const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
    template_name: { type: String, required: true },
    subject: { type: String, required: true },
    mail: { type: String, required: true },
    user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',  // Reference to the template model
          required: true,  // This can be optional, depending on your requirement
        },
    
}, {
    timestamps: true,  // Add timestamps to the schema. createdAt and updatedAt fields will be automatically added.
});

module.exports = mongoose.model("template", templateSchema);
