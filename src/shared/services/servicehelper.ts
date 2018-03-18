export function status(response: Response) {
  if (response.status >= 200 && response.status < 400) {
    return response.json();
  }

  throw response;
}

export function parseError(error: any) {
  if (!(error instanceof Error)) {
    return new Promise<any>((_resolve, reject) => reject(error.json()));
  }

  return error;
}
