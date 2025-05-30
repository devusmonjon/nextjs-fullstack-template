import {model, models, Schema} from "mongoose";
import Client from "./client.model";
import Representative from "./representative.model";
import Performer from "./performer.model";
import CaseType from "./case-type.model";
import Branch from "./branch.model";
import Region from "./region.model";
import District from "./district.model";
import ClientStaff from "@/database/client-staff.model";

// 1. Talabnoma/Habarnoma/Arizalar uchun sub-schema
const claimDocumentSchema = new Schema({
    number: {type: String, required: true}, // рақами
    date: {type: Date, required: true}, // санаси
    requested_amount: {type: Number, required: true}, // сўралган суммаси
    day_count: {type: Number, default: 0}, // кун сони
    overdue_days: {type: Number, default: 0}, // қарзини кечиктирган кун
    pdf_file: {type: String, required: true}, // PDF fayl (URL yoki filename)
});

// 2. Kredit shartnomasi uchun sub-schema
const creditAgreementSchema = new Schema({
    number: {type: String, required: true}, // рақами
    date: {type: Date, required: true}, // санаси
    amount: {type: Number, required: true}, // суммаси
    term: {type: Number, default: 0}, // муддати
    pdf_file: {type: String, required: true}, // PDF fayl (URL yoki filename)
});

// 3. Sug'irta shartnomasi uchun schema
const insurancePolicySchema = new Schema({
    insurance_branch: {type: String, required: true}, // суғуртачи филиали
    product_name: {type: String, required: true}, // суғурта маҳсулоти номи
    contract_count: {type: Number, default: 1}, // тузилган шартнома сони
    policy_number: {type: String, required: true}, // полис рақами
    start_date: {type: Date, required: true}, // санаси (boshlanish)
    end_date: {type: Date, required: true}, // муддати (yakun)
    coverage_amount: {type: Number, required: true}, // суғурта суммаси
    pdf_file: {type: String, required: true}, // PDF ilova
});

// 4. Qarzdor haqida malumot
const debtorSchema = new Schema({
    ownership_type: {
        type: String,
        enum: ["juridical", "individual"], // enum qiymatlari
        required: true,
    },
    full_name_or_entity: {type: String, required: true}, // Ф.И.Ш. ёки ХЮС номи
    tin: {type: String, required: true}, // СТИР / ПИНФЛ
    passport: {type: String}, // паспорт маълумоти
    birth_date: {type: String}, // туғилган йили (format: YYYY-MM-DD yoki DD.MM.YYYY)
    region: Region.modelName, // вилоят
    district: District.modelName, // туман
    street: {type: String}, // кўча
    house_number: {type: String}, // уй рақами
    phone_number: {type: Number}, // тел рақами
    note: {type: String}, // изоҳ
});

// 5. Qarzdor haqida malumot
const paidCompensationSchema = new Schema({
    payment_date: {type: Date, required: true}, // санаси
    audit_count: {type: Number, default: 0}, // проверки в сони
    primary_payment_count: {type: Number, default: 0}, // тўланган товон сони
    primary_amount: {type: Number, required: true}, // суммаси
    additional_date: {type: Date}, // қўшимча санаси
    additional_count: {type: Number, default: 0}, // қўшимча сони
    additional_amount: {type: Number, default: 0}, // қўшимча суммаси
    total_amount: {type: Number, required: true}, // СУММАСИ
    pdf_file: {type: String, required: true}, // PDF илова килин кк
});

// 6. To'lash shartnomasi
const actSchema = new Schema({
    number: {type: String, required: true}, // рақами
    date: {type: Date, required: true}, // санаси
});

// 7. Billing entry
const billingEntrySchema = new Schema({
    billing_code: {type: String, required: true},
    amount: {type: Number, required: true},
});

// 8. SSP submission
const SSPSubmissionSchema = new Schema({
    submission_date: {type: Date},                        // Санаси
    total_amount: {type: Number, default: 0},             // Суммаси
    ssp_outgoing_number: {type: String},                   // ССПдан аризани чиқиш рақами
    ssp_official_date: {type: Date},                       // ССПда расмийлаштирилган ариза санаси
});

// 9. Court claim
const courtClaimSchema = new Schema({
    submitted_electronically_at: {type: Date},          // электрон судга топширилган сана
    submission_date: {type: Date},                     // судга топширилган сана (qo‘shilgan)
    claim_amount: {type: Number, default: 0},          // даъво суммаси
    court_type: {
        type: String,
        enum: ["civil", "economic", "administrative", "criminal"],
        required: true,
    }, // Суд номи
});

// 10. Court resolution
const courtResolutionSchema = new Schema({
    document_number: {type: String, required: true},     // рақами
    decision_date: {type: Date, required: true},         // санаси
    amount: {type: Number, required: true},             // суммаси
});

// 11. Enforcement action
const enforcementActionSchema = new Schema({
    district_MIB: {type: String, required: true},       // туман МИБ номи
    case_number: {type: String, required: true},        // МИБ иш рақами
    total_amount: {type: Number, default: 0},           // суммаси
    status: {
        type: String,
        enum: ["in_progress", "completed", "closed", "cancelled"],
        default: "in_progress",
    }, // ҳолати
});


const caseSchema = new Schema(
    {
        unique_id: {
            type: String,
            unique: true,
        },
        dela_order_number: {
            type: Number,
            unique: true,
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: Client.modelName,
            required: true,
        },
        representative: {
            type: Schema.Types.ObjectId,
            ref: Representative.modelName,
            required: true,
        },
        performer: {
            type: Schema.Types.ObjectId,
            ref: Performer.modelName,
            required: false,
            default: null,
        },
        case_documents_attached: {
            type: Boolean,
            required: true,
            default: false, // yoki kerakli default qiymat
        },
        case_type: {
            type: Schema.Types.ObjectId,
            ref: CaseType.modelName,
            required: true,
        },
        claimant_branch: {
            type: Schema.Types.ObjectId,
            ref: Branch.modelName,
            required: false,
            default: null,
        },

        claim_documents: [claimDocumentSchema], // talabnomalar, habarnomalar, arizalar
        credit_agreements: [creditAgreementSchema], // kredit (yoki boshqa) shartnomalar

        insurancePolicy: insurancePolicySchema, // sug'irta shartnomasi

        debtor: debtorSchema, // qarzdor haqida malumot

        paid_compensation: paidCompensationSchema, // to'lash shartnomasi

        act: actSchema,

        billing_payment: billingEntrySchema,

        ssp_submission: SSPSubmissionSchema,

        court_claim: courtClaimSchema,

        court_resolution: courtResolutionSchema,

        enforcement_action: enforcementActionSchema,

        case_status: {
            type: String,
            enum: ["archive", "in_process", "court", "draft"],
            default: "draft",
            required: true,
        },

        remaining_subrogation_amount: {
            type: Number,
            required: true,
            default: 0,
        },

        enforced_recovery: new Schema({
            recovered_date: {type: Date},              // Жами санаси
            total_recovered: {type: Number, default: 0}, // ЖАМИ ундирилган суммаси
        }),

        responsible_user: {
            type: Schema.Types.ObjectId,
            ref: ClientStaff.modelName,
            required: true,
        },

        generalStatus: {
            type: String,
            enum: [
                "new",                    // yangi ish
                "demand_issued",          // Talabnoma chiqarilgan
                "submitted_to_court",     // Sudga yuborilgan
                "returned_from_court",    // Suddан qaytarilgan
                "closed_by_payment",      // Qarzdorligi yopilgan
                "unrecoverable",          // Undirish imkoniyati yo‘q ishlari
                "under_review",           // Ko‘rib chiqish bosqichida
            ],
            default: "new",
            required: true
        },

        sud_status: {
            type: String,
            enum: [
                "not_issued",    // Talabnoma chiqarilmagan
                "issued",        // Talabnoma chiqarilgan
                "prepared_for_court", // Sudga tayyorlangan
                "submitted_to_court", // Sudga kiritilgan
            ],
            required: true,
            default: "not_issued",
        },

        sud_case_id: {
            type: String,
            required: false,
            default: null,
        }
    },
    {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

const Case = models?.Case || model?.("Case", caseSchema);

export default Case;
