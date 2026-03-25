import { type FormikErrors } from "formik";

export const getErrorMessage = (
    error: string | string[] | FormikErrors<unknown> | FormikErrors<unknown>[] | undefined
): string => {
    if (!error) return "";
    if (typeof error === "string") return error;

    if (Array.isArray(error)) {
        const firstError = error[0];
        return typeof firstError === "string" ? firstError : "Invalid field";
    }

    return "Invalid field";
};
