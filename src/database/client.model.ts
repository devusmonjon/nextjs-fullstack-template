import {model, models, Schema, Types} from "mongoose";
import Representative from "./representative.model";
import Performer from "./performer.model";

const clientSchema = new Schema(
    {
        prefix: {
            type: String,
            required: true,
        },
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: false,
        },
        bank_account_number: {
            type: Number,
            required: true,
        },
        mfo: {
            type: Number,
            required: true,
        },
        inn: {
            type: Number,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["superadmin", "client"],
            default: "client",
        },
        representative: {
            type: [Schema.Types.ObjectId],
            ref: Representative.modelName,
            default: [],
            validate: {
                validator: function (val: any) {
                    return (
                        Array.isArray(val) &&
                        val.every(
                            (v) => typeof v === "string" || v instanceof Types.ObjectId
                        )
                    );
                },
                message: "representatives must be an array of ObjectIds",
            },
        },
        performers: {
            type: [Schema.Types.ObjectId],
            ref: Performer.modelName,
            default: [],
            validate: {
                validator: function (val: any) {
                    return (
                        Array.isArray(val) &&
                        val.every(
                            (v) => typeof v === "string" || v instanceof Types.ObjectId
                        )
                    );
                },
                message: "performers must be an array of ObjectIds",
            },
        },

        sud_variables: new Schema({
            token: {
                type: String,
                required: true,
            },
            entity: {
                type: String,
                required: true,
            }
        })
    },
    {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

clientSchema.virtual("fullName").get(function () {
    return `${this.first_name}${this.last_name ? ` ${this.last_name}` : ""}`;
});

const Client = models?.Client || model?.("Client", clientSchema);

export default Client;
