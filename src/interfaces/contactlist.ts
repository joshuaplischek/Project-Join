/**
 * Interface for contact data with ID.
 */
export interface Contactlist {
  id?: string | undefined;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * Interface for contact data stored in Firestore.
 */
export interface ContactlistFirestoreData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}
