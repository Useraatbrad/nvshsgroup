const db = firebase.firestore();
const auth = firebase.auth();

// Check if user is logged in
auth.onAuthStateChanged(user => {
  if (user) {
    // User is logged in, show chat and DM containers
    // You can add code here to fetch messages, DMs, and location data
  } else {
    // User is not logged in, redirect to login page or show login form
  }
});

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
