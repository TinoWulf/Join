import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getDatabase,ref,set,onValue,update,push,remove,get,query} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile }from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDkdA360D1fwMdP8uys9jJuCA1aGRUNpC8",
  authDomain: "join-8035a.firebaseapp.com",
  databaseURL:
    "https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-8035a",
  storageBucket: "join-8035a.firebasestorage.app",
  messagingSenderId: "266948276237",
  appId: "1:266948276237:web:7db67cd17d2462270ca544",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app,auth, database, ref, set, onValue, update, push, remove, get, query, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile };

async function createUserAndProfile() {
  const name = "Kristof Developer";
  const email = "kristof@dev.com";
  const password ="123456"; // Password should be at least 6 characters long;
  const acceptedPolicy = true;

  if (!acceptedPolicy) {
    console.error("You must accept the terms and privacy policy.");
    return;
  }
  if (password.length < 6) {
    console.error("Password must be at least 6 characters long.");
    return;
  }
  try {
    const userData = {
      id: Date.now(), // Unique identifier for the user 
      name: name,
      email: email,
      acceptedPolicy: acceptedPolicy,
      created_at: Date.now(),
      last_login: Date.now(),
    };
    createUser(userData);
  } catch (error) {
    console.error("Sign up error:", error);
    logErrorConsole(error);
  }
}

function logErrorConsole(error) {
  let errorMessage = "An unknown error occurred.";
  switch (error.code) {
    case "auth/email-already-in-use":
      errorMessage = "This email is already registered.";
      break;
    case "auth/invalid-email":
      errorMessage = "Please enter a valid email address.";
      break;
    case "auth/weak-password":
      errorMessage = "The password is too weak. Please choose a stronger one.";
      break;
    default:
      errorMessage = `Error: ${error.message}`;
      break;
  }
  console.error(errorMessage);
}

// createUserAndProfile();

async function createUser(user) {
  const usersRef = ref(database, "users/" + user.id);
  try {
    await set(usersRef, user);
    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

function getUserById(userId) {
  const usersRef = ref(database, "users/" + userId);
  onValue(usersRef, (snapshot) => {
    if (snapshot.exists()) {
      const user = snapshot.val();
      console.log("User data:", user);
    } else {
      console.log("No user found with ID:", userId);
    }
  }, (error) => {
    console.error("Error retrieving user:", error);
  }
  );
}

async function getAllUser() {
  const usersRef = ref(database, "users");
  try {
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      for (const userId in users) {
        const user = users[userId];
        console.log(
          `User ID: ${userId}, Name: ${user.name}, Email: ${user.email}`
        );
      }
      return users;
    } else {
      console.log("No users found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving users:", error);
  }
}

// getAllUser();

const contact = {
  id: Date.now(),
  name: "John Doe",
  email: "johndoe@dev.de",
  phone: "+1234567890",
};

async function createContact(contact) {
  const contactsRef = ref(database, "contacts/" + contact.id);
  try {
    await set(contactsRef, contact);
    console.log("Contact created successfully");
  } catch (error) {
    console.error("Error creating contact:", error);
  }
}

// createContact(contact);

async function getAllContacts() {
  const contactsRef = ref(database, "contacts");
  try {
    const snapshot = await get(contactsRef);
    if (snapshot.exists()) {
      const contacts = snapshot.val();
      for (const contactId in contacts) {
        const contact = contacts[contactId];
        console.log(
          `Contact ID: ${contactId}, Name: ${contact.name}, Email: ${contact.email}`
        );
      }
      return contacts;
    } else {
      console.log("No contacts found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving contacts:", error);
  }
}
// getAllContacts();
const task = {
  id: Date.now(),
  title: "Run Lighthouse Performance Audit",
  description:
    "Use Chrome Lighthouse to evaluate the web app's performance, accessibility, and SEO. Document and prioritize areas for improvement.",
  dueDate: "2025-07-14",
  category: "Optimization",
  priority: "low",
  assignedTo: [
    { name: "Amira Soltan", email: "amira.soltan@jobboard.dev" },
  ],
  subtasks: [
    { title: "Run Lighthouse on staging", checked: false },
    { title: "Document all metrics < 90", checked: false },
    { title: "Propose optimization actions", checked: false },
  ],
};

async function createTask(task) {
  const tasksRef = ref(database, "tasks/" + task.id);
  try {
    await set(tasksRef, task);
    console.log("Task created successfully");
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

// createTask(task);


