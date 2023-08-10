const db = firebase.firestore();

// Send message to group chat
document.getElementById('send-button').addEventListener('click', () => {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value;

  if (message.trim() !== '') {
    // Add message to Firestore
    db.collection('groupChat').add({
      text: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    messageInput.value = '';
  }
});

// Display messages
const messageContainer = document.getElementById('message-container');
db.collection('groupChat').orderBy('timestamp').onSnapshot(snapshot => {
  messageContainer.innerHTML = '';
  snapshot.forEach(doc => {
    const messageData = doc.data();
    const messageElement = document.createElement('div');
    messageElement.textContent = messageData.text;
    messageContainer.appendChild(messageElement);
  });
});

// Display map
function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 37.7749, lng: -122.4194 }, // Default location (San Francisco)
    zoom: 10
  });

  // Add markers for user locations
  db.collection('userLocations').onSnapshot(snapshot => {
    snapshot.forEach(doc => {
      const location = doc.data();
      new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.username
      });
    });
  });
}
