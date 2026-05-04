const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const eishService = {
  async verifyIin(iin: string) {
    await delay(300 + Math.random() * 200);
    const digit = parseInt(iin[0]);
    return {
      iin,
      isValid: true,
      fullName: digit % 2 === 0 ? "Асанов Берик Жасыланович" : "Сейтова Айгерим Маратовна",
      birthDate: "1990-06-15",
      nationality: "Казахстан",
      status: "ACTIVE",
      source: "ЕИШ (мок)",
    };
  },

  async verifyBin(bin: string) {
    await delay(300 + Math.random() * 200);
    return {
      bin,
      isValid: true,
      companyName: "ТОО «Инновация Плюс»",
      registrationDate: "2018-03-20",
      director: "Асанов Берик Жасыланович",
      status: "ACTIVE",
      taxDebt: 0,
      employeeCount: 24,
      source: "ЕИШ (мок)",
    };
  },
};
