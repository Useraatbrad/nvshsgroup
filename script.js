const db = firebase.firestore();
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Send message to group chat
sendButton.addEventListener('click', sendMessage);

// Handle "Enter" key press
messageInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent line break in the textarea
    sendMessage();
  }
});

function sendMessage() {
  const message = messageInput.value;

  if (message.trim() !== '') {
    // Add message to Firestore with sender's user ID (assuming you have authentication)
    db.collection('groupChat').add({
      text: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userId: firebase.auth().currentUser.uid // Replace with actual user ID
    });

    messageInput.value = '';
  }
}

// Display messages in real-time
const messageContainer = document.getElementById('message-container');
db.collection('groupChat').orderBy('timestamp').onSnapshot(snapshot => {
  messageContainer.innerHTML = '';
  snapshot.forEach(doc => {
    const messageData = doc.data();
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = messageData.text;
    
    // Add a class to differentiate between messages sent by the current user and others
    if (messageData.userId === firebase.auth().currentUser.uid) {
      messageElement.classList.add('my-message');
    }
    
    messageContainer.appendChild(messageElement);
    
    // Scroll to the latest message
    messageContainer.scrollTop = messageContainer.scrollHeight;
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
