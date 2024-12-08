import { encrypt, decrypt } from './crypto.js';

    const websiteInput = document.getElementById('website');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const generatePasswordButton = document.getElementById('generate-password');
    const savePasswordButton = document.getElementById('save-password');
    const copyPasswordButton = document.getElementById('copy-password');
    const passwordList = document.getElementById('password-list');

    let passwords = [];

    // Load passwords from local storage
    const loadPasswords = async () => {
      const storedPasswords = localStorage.getItem('passwords');
      if (storedPasswords) {
        passwords = JSON.parse(storedPasswords);
        await displayPasswords();
      }
    };

    // Display passwords in the UI
    const displayPasswords = async () => {
      passwordList.innerHTML = '';
      for (const password of passwords) {
        const decryptedPassword = await decrypt(password.encryptedPassword);
        const passwordElement = document.createElement('div');
        passwordElement.classList.add('bg-gray-50', 'p-4', 'mb-4', 'rounded', 'shadow-md');
        passwordElement.innerHTML = `
          <div class="mb-2">
            <strong class="text-gray-700">Website:</strong> ${password.website}
          </div>
          <div class="mb-2">
            <strong class="text-gray-700">Username:</strong> ${password.username}
          </div>
          <div class="mb-2">
            <strong class="text-gray-700">Password:</strong> ${decryptedPassword}
          </div>
          <div class="flex justify-between">
            <button class="copy-password bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" data-password="${decryptedPassword}">Copy</button>
            <button class="delete-password bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" data-website="${password.website}">Delete</button>
          </div>
        `;
        passwordList.appendChild(passwordElement);
      }

      // Add event listeners to delete buttons
      const deleteButtons = document.querySelectorAll('.delete-password');
      deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
          const website = event.target.getAttribute('data-website');
          passwords = passwords.filter(password => password.website !== website);
          localStorage.setItem('passwords', JSON.stringify(passwords));
          await displayPasswords();
        });
      });

      // Add event listeners to copy buttons
      const copyButtons = document.querySelectorAll('.copy-password');
      copyButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
          const password = event.target.getAttribute('data-password');
          await navigator.clipboard.writeText(password);
          alert('Password copied to clipboard!');
        });
      });
    };

    // Generate a random password
    const generateRandomPassword = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
      let password = '';
      for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      return password;
    };

    // Encrypt and save a password
    const savePassword = async () => {
      const website = websiteInput.value.trim();
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (!website || !username || !password) {
        alert('Please fill in all fields.');
        return;
      }

      const encryptedPassword = await encrypt(password);

      passwords.push({ website, username, encryptedPassword });
      localStorage.setItem('passwords', JSON.stringify(passwords));
      await displayPasswords();

      // Clear input fields
      websiteInput.value = '';
      usernameInput.value = '';
      passwordInput.value = '';
    };

    // Copy password to clipboard
    copyPasswordButton.addEventListener('click', async () => {
      const password = passwordInput.value.trim();
      if (password) {
        await navigator.clipboard.writeText(password);
        alert('Password copied to clipboard!');
      } else {
        alert('No password to copy.');
      }
    });

    // Generate a password and fill it in the password field
    generatePasswordButton.addEventListener('click', () => {
      const randomPassword = generateRandomPassword();
      passwordInput.value = randomPassword;
    });

    // Save password when the save button is clicked
    savePasswordButton.addEventListener('click', savePassword);

    // Load passwords when the app starts
    loadPasswords();
