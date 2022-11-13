export type BookFormField = 'title' | 'author' | 'description';

// Special class for React state
export class FieldError {
  private _fieldName: BookFormField;
  private _error: string;

  constructor(fieldName: BookFormField, error?: string) {
    this._fieldName = fieldName;
    this._error = error || '';
  }

  public get error() {
    return this._error;
  }

  public setError = (error: string): FieldError => {
    return new FieldError(this._fieldName, error);
  };
}
