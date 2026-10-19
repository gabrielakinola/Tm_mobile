declare module 'qrcode' {
  const QRCode: {
    create: (
      data: string,
      options?: { errorCorrectionLevel?: string },
    ) => {
      modules: {
        size: number;
        data: ArrayLike<number>;
      };
    };
  };

  export default QRCode;
}
