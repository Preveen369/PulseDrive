export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const prettyContext = {
        operation: context.operation,
        path: context.path,
        ...(context.requestResourceData && { requestData: context.requestResourceData }),
    }
    
    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(
      prettyContext,
      null,
      2
    )}`;
    
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;

    // This is to make the error readable in the browser console
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
