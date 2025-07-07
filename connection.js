import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  push,
  remove,
  get,
  child,
  query,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
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
const database = getDatabase(app);

if (!database) {
  console.error("Database connection failed");
} else {
  console.log(database);
}

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

getAllUser();

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
getAllContacts();

const task = {
  id: Date.now(),
  title: "Integrate Firebase with Web App Using NPM",
  description:
    "Set up Firebase in a frontend project using Vite and NPM, enabling database access and modular imports.",
  dueDate: "2025-07-10",
  category: "Development",
  priority: "urgent",
  assignedTo: [
    { name: "Alice Johnson", email: "alice@example.com" },
    { name: "Bob Smith", email: "bob@example.com" },
  ],
  subtasks: [
    {
      title: "Initialize Vite project",
    },
    {
      title: "Install Firebase via NPM",
    },
    {
      title: "Set up Firebase configuration",
    },
    {
      title: "Test writing data to Realtime Database",
    },
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

async function getAllTasks() {
  const tasksRef = ref(database, "tasks");
  try {
    const snapshot = await get(tasksRef);
    if (snapshot.exists()) {
      const tasks = snapshot.val();
      for (const taskId in tasks) {
        const task = tasks[taskId];
        console.log(
          `Task ID: ${taskId}, Title: ${task.title}, Category: ${task.category}`
        );
      }
      return tasks;
    } else {
      console.log("No tasks found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving tasks:", error);
  }
}

getAllTasks();
