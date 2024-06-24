import { errorHandler } from "../utils/error.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import { Contact } from "../model/contact.model.js";

export const createContact = async (req, res, next) => {
  try {
    const { name, phone, email, linkedin, twitter } = req.body;

    if (!name || !phone || !email || !linkedin || !twitter) {
      return next(errorHandler(400, "all fields are required!"));
    }

    const encryptedName = encrypt(name.trim().toLowerCase());
    const encryptedPhone = encrypt(phone.toString());
    const encryptedEmail = encrypt(email);
    const encryptedLinkedin = encrypt(linkedin);
    const encryptedTwitter = encrypt(twitter);

    const contact = await Contact.create({
      name: encryptedName,
      phone: encryptedPhone,
      email: encryptedEmail,
      linkedin: encryptedLinkedin,
      twitter: encryptedTwitter,
    });

    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const editContact = async (req, res, next) => {
  const { name, email, phone, linkedin, twitter } = req.body;

  const contacts = await Contact.find();

  const contact = contacts.filter((contact) => decrypt(contact.name) === name);

  if (!contact) {
    return next(errorHandler(404, "contact not found"));
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    contact[0]._id,
    {
      $set: {
        name: encrypt(name),
        email: encrypt(email),
        phone: encrypt(phone).toString(),
        linkedin: encrypt(linkedin),
        twitter: encrypt(twitter),
      },
    },
    { new: true }
  );

  return res.status(200).json(updatedContact);
};

export const searchContact = async (req, res, next) => {
  const { search_token } = req.body;

  if (!search_token) {
    return next(errorHandler(404, "Search token required"));
  }

  const newToken = search_token.trim().replace(/\s+/g, "").toLowerCase();

  try {
    const contacts = await Contact.find();

    const matchedContacts = contacts.filter((contact) => {
      const decryptedName = decrypt(contact.name).toLowerCase();

      return decryptedName.includes(newToken);
    });

    console.log(matchedContacts);

    if (matchedContacts.length === 0) {
      return next(errorHandler(404, "User not found"));
    }

    const decryptedSearchResults = matchedContacts.map((contact) => ({
      name: decrypt(contact.name),
      email: decrypt(contact.email),
      linkedin: decrypt(contact.linkedin),
      phone: decrypt(contact.phone),
      twitter : decrypt(contact.twitter)
    }));

    console.log(decryptedSearchResults);

    return res.status(200).json({ decryptedSearchResults });
  } catch (error) {
    return next(error);
  }
};

export const contactData = async (req,res,next) =>{
  const contacts = await Contact.find();

  const queryContacts = contacts.filter((contact)=>{
    const decryptedToken = decrypt(contact.name);

    return decryptedToken.includes(req.query.name);
  })
  

  const queryContactsApi = queryContacts.map((contact) => ({
    name: decrypt(contact.name),
    email: decrypt(contact.email),
    linkedin: decrypt(contact.linkedin),
    phone: decrypt(contact.phone),
    twitter : decrypt(contact.twitter)
  }));

  return res.json({queryContactsApi});
}
