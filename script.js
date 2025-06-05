const form = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");
const searchInput = document.getElementById("searchInput");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editIndex = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const photoInput = document.getElementById("photo");

  const reader = new FileReader();
  reader.onload = () => {
    const photo = reader.result;

    const newContact = { name, phone, email, notes, photo };

    if (editIndex !== null) {
      contacts[editIndex] = newContact;
      editIndex = null;
    } else {
      contacts.push(newContact);
    }

    localStorage.setItem("contacts", JSON.stringify(contacts));
    form.reset();
    renderContacts();
  };

  if (photoInput.files.length > 0) {
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    reader.onload();
  }
});

function renderContacts() {
  const filter = searchInput.value.toLowerCase();
  contactList.innerHTML = "";

  contacts
    .filter(c => c.name.toLowerCase().includes(filter))
    .forEach((c, index) => {
      const li = document.createElement("li");
      li.className = "contact-card";

      const info = document.createElement("div");
      info.className = "contact-info";

      const img = document.createElement("img");
      img.src = c.photo || "https://via.placeholder.com/50";
      img.className = "contact-photo";

      info.innerHTML = `
        <strong>${c.name}</strong><br/>
        📞 ${c.phone} <br/>
        📧 ${c.email} <br/>
        📝 ${c.notes}
      `;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Editar";
      editBtn.onclick = () => {
        document.getElementById("name").value = c.name;
        document.getElementById("phone").value = c.phone;
        document.getElementById("email").value = c.email;
        document.getElementById("notes").value = c.notes;
        editIndex = index;
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "Eliminar";
      delBtn.onclick = () => {
        contacts.splice(index, 1);
        localStorage.setItem("contacts", JSON.stringify(contacts));
        renderContacts();
      };

      li.appendChild(img);
      li.appendChild(info);
      li.appendChild(editBtn);
      li.appendChild(delBtn);

      contactList.appendChild(li);
    });
}

searchInput.addEventListener("input", renderContacts);

renderContacts();
