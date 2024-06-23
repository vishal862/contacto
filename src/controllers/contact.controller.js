import { errorHandler } from "../utils/error.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import { Contact } from "../model/contact.model.js";

export const createContact = async (req, res, next) => {
  try {
    const { name, phone, email, linkedin, twitter } = req.body;

    if (!name || !phone || !email || !linkedin || !twitter) {
      return next(errorHandler(400, "all fields are required!"));
    }

    const encryptedName = encrypt(name.trim().replace(/\s+/g, ''));
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

  const updatedContact = await Contact.findByIdAndUpdate(contact[0]._id,{
    $set : {
        name : encrypt(name),
        email : encrypt(email),
        phone : encrypt(phone).toString(),
        linkedin : encrypt(linkedin),
        twitter : encrypt(twitter)
    }
  },{new : true})

  return res.status(200).json(updatedContact);
};

export const searchContact = async (req,res,next)=>{
    const {search_token} = req.body;

    if(!search_token){
        return next(errorHandler(404,"search token required"))
    }

    const contacts = await Contact.find();

    const matchedContact = contacts.filter((contact)=>decrypt(contact.name).includes(search_token));

    console.log(matchedContact);

    const decryptedSearchToken = matchedContact.map((contact)=>decrypt(contact.name));

    console.log(decryptedSearchToken);

    if(!matchedContact){
        return next(errorHandler(404,'user not found'))
    }

    return res.status(200).json({decryptedSearchToken})
}
