function getCookie(name) {
    const cookieArray = document.cookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();

        if (cookie.startsWith(name + '=')) {
            return cookie.split('=')[1];
        }
    }
    return null;

};


var map = L.map('map', { doubleClickZoom: false }).setView([52.0, 19.0], 6);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);
fetch('/api/photos/')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                // Podstawowa treść dymka (dodane feature.properties.user)
                let popupContent = `
                    <div style="text-align: center;">
                        <h3 style="margin-top: 0;">${feature.properties.title}</h3>
                        <img src="${feature.properties.image}" alt="${feature.properties.title}" style="max-width: 100%; height: auto; border-radius: 5px;">
                        <p style="margin-top: 0; font-size: 12px; color: gray;">
                            Dodane przez: <b>${feature.properties.user}</b>
                        </p>
                    </div>
                `;

                // ZMIANA: Używamy feature.properties.user zamiast photo.user
                if (currentUser === feature.properties.user || isStaff === true) {
                    popupContent += `
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                        <button onclick="deletePhoto(${feature.id})" 
                                style="background-color: #ff4d4d; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold;">
                            Usuń to zdjęcie
                        </button>
                    `;
                }

                layer.bindPopup(popupContent, { minWidth: 200, autoPan: true, autoPanPadding: [50, 50] });
            }
        }).addTo(map);
    });

map.on('contextmenu', function (e) {
    map.flyTo(e.latlng, map.getZoom(), {
        animate: true,
        duration: 0.5
    });

    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    L.popup()
        .setLatLng(e.latlng)
        .setContent(`
                        <div style="text-align: center; min-width: 220px; font-family: Arial, sans-serif;">
                            <h4 style="margin-bottom: 10px;">Add New Photo</h4>
                            
                            <input type="text" id="new-title" placeholder="Enter title..." style="width: 100%; margin-bottom: 10px; padding: 5px; box-sizing: border-box;"><br>
                            
                            <input type="file" id="new-image" accept="image/*" style="display: none;" 
                                onchange="document.getElementById('file-name').textContent = this.files[0] ? this.files[0].name : 'No file chosen'">
                            
                            <label for="new-image" style="background: #e1e1e1; border: 1px solid #999; padding: 5px 10px; cursor: pointer; border-radius: 3px; display: inline-block; font-size: 13px;">
                                Choose File
                            </label>
                            
                            <div id="file-name" style="font-size: 11px; color: #666; margin-top: 5px; margin-bottom: 15px;">No file chosen</div>
                            
                            <button onclick="savePhoto(${lat}, ${lng})" style="width: 100%; padding: 8px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">
                                Save to Database
                            </button>
                        </div>
                        `)
        .openOn(map);
});

function savePhoto(lat, lng) {
    const title = document.getElementById('new-title').value;
    const imageFile = document.getElementById('new-image').files[0];

    if (!title || !imageFile) {
        alert("Please fill in the title and select a photo!");
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile);
    formData.append('pointLocation', `POINT(${lng} ${lat})`);

    fetch('/api/photos/', {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        body: formData
    }).then(response => {
        if (response.ok) {
            map.closePopup();
            const imageUrl = URL.createObjectURL(imageFile);
            L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`
                        <div style="text-align: center;">
                        <h3 style="margin-top: 0;">${title}</h3>
                        <img src="${imageUrl}" alt="${title}" style="max-width: 200px; height: auto; border-radius: 5px;">
                        </div>
                        `, { minWidth: 200, autoPan: false }
                )
                .openPopup();
            map.panBy([0, -50]);
        }
        else {
            alert("Something gone wrong with saving Photo")
        }
    });
};

document.getElementById('locate-btn').addEventListener('click', function () {
    map.locate({ setView: true, maxZoom: 16 })
});

let userLocationMarker;
map.on('locationfound', function (e) {
    if (userLocationMarker) {
        map.removeLayer(userLocationMarker);
    }

    userLocationMarker = L.circleMarker(e.latlng, {
        radius: 8,
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    })
        .addTo(map)
        .bindPopup("Tu jesteś!")
        .openPopup();
});


function deletePhoto(photoId) {
    if (!confirm("Are you sure you want delete this photo?")) {
        return;
    }

    const csrftoken = getCookie("csrftoken");

    fetch(`/api/photos/${photoId}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                alert("Photo was delete");
                window.location.reload();
            } else {
                alert("Error with deleting photo");
            }
        })
        .catch(error => console.error('System error: ', error));
}
