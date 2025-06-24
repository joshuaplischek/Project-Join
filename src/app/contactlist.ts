export interface Contactlist {
 id?: string | undefined;
 firstName: string;
 lastName: string;
 email: string;
 phone: string;
}

export interface ContactlistFirestoreData {
 firstName?: string;
 lastName?: string;
 email?: string;
 phone?: string;
}