import {model, models, Schema} from "mongoose";

const clientStaffSchema = new Schema({
        first_name: {type: String, required: true},
        last_name: {type: String, required: false},
        phone: {type: Number, required: true},
        password: {type: String, required: true},
        role: {
            enum: ["view_only", "can_add_and_edit"]
        }
    },
    {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});

clientStaffSchema.virtual("fullName").get(function () {
    return `${this.first_name}${this.last_name ? ` ${this.last_name}` : ""}`;
});

const ClientStaff = models.ClientStaff || model("ClientStaff", clientStaffSchema);
export default ClientStaff;