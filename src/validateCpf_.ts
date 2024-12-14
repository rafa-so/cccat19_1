function clean(cpf: string) {
	return cpf.replace(/\D/g, "");
}

function allDigitisTheSame(cpf: string) {
	return cpf.split("").every(c => c === cpf[0])
}

function calculateDigit(cpf: string, factor: number) {
	let total = 0;
	for (const digit of cpf) {
		if (factor > 1) total += parseInt(digit) * factor--;
	}
	const remainder = total % 11;
	return (remainder < 2) ? 0 : 11 - remainder;
}

function extractDigit(cpf: string) {
	return cpf.slice(9);
}

export function validateCpf (cpf: string) {
	if (!cpf) return false;
	cpf = clean(cpf);
	if (cpf.length != 11) return false;
	if (allDigitisTheSame(cpf)) return false;
	return extractDigit(cpf) == `${calculateDigit(cpf, 10)}${calculateDigit(cpf, 11)}`;
}