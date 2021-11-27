const Contact = require("../model/ContactModel");

exports.index = async (req, res) => {
  try {
    const contacts = await Contact.getAllContacts();
    res.render("index", { contacts });
  } catch (error) {
    console.log(error);
  }
};
