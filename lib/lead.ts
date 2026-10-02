import { z } from "zod";
const short = z
  .string()
  .trim()
  .min(1, "Please fill this in.")
  .max(160, "Please use 160 characters or fewer.");
export const leadSchema = z
  .object({
    movingFrom: short,
    movingTo: short,
    movingDate: z.union([
      z.literal(""),
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine(
          (v) =>
            !Number.isNaN(Date.parse(v)) &&
            new Date(v).toISOString().slice(0, 10) === v,
          "Choose a valid date.",
        ),
    ]),
    propertyType: z.enum([
      "Apartment",
      "Condo",
      "House",
      "Office",
      "Storage",
      "Other",
    ]),
    size: z.enum([
      "Studio",
      "1 bedroom",
      "2 bedrooms",
      "3 bedrooms",
      "4+ bedrooms",
      "Small office",
      "Large office",
      "Not sure yet",
    ]),
    service: z.enum(["Residential Moving", "Office Moving", "Not sure yet"]),
    name: short,
    phone: z
      .string()
      .trim()
      .max(30)
      .refine(
        (v) =>
          /^[+\d\s().-]+$/.test(v) &&
          v.replace(/\D/g, "").length >= 10 &&
          v.replace(/\D/g, "").length <= 15,
        "Enter a phone number with 10–15 digits.",
      ),
    email: z.union([z.literal(""), z.email().max(254)]),
    notes: z.string().trim().max(2000),
    source: z.enum(["/quote", "/thank-you"]),
  })
  .strict();
export type Lead = z.infer<typeof leadSchema>;
