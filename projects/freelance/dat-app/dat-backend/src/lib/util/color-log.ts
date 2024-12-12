const colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	italic: "\x1b[3m",
	underscore: "\x1b[4m",
	blink: "\x1b[5m",
	reverse: "\x1b[7m",
	hidden: "\x1b[8m",

	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",

	bgBlack: "\x1b[40m",
	bgRed: "\x1b[41m",
	bgGreen: "\x1b[42m",
	bgYellow: "\x1b[43m",
	bgBlue: "\x1b[44m",
	bgMagenta: "\x1b[45m",
	bgCyan: "\x1b[46m",
	bgWhite: "\x1b[47m",
};

const icons = {
	success: "✅",
	error: "❌",
	warning: "⚠️",
	info: "ℹ️",
	star: "⭐",
	heart: "❤️",
	time: "⏱️",
	light: "💡",
};

const colorLog = {
	success(message: string): void {
		console.log(
			`${colors.green}${colors.bright}${icons.success}  SUCCESS: ${colors.reset}${colors.green}${message}${colors.reset}`,
		);
	},

	error(message: string): void {
		console.log(
			`${colors.red}${colors.bright}${icons.error}  ERROR: ${colors.reset}${colors.red}${message}${colors.reset}`,
		);
	},

	warning(message: string): void {
		console.log(
			`${colors.yellow}${colors.bright}${icons.warning}  WARNING: ${colors.reset}${colors.yellow}${message}${colors.reset}`,
		);
	},

	info(message: string): void {
		console.log(
			`${colors.blue}${colors.bright}${icons.info}  INFO: ${colors.reset}${colors.blue}${message}${colors.reset}`,
		);
	},

	important(message: string): void {
		console.log(
			`${colors.magenta}${colors.bright}${icons.star}  IMPORTANT: ${colors.reset}${colors.magenta}${message}${colors.reset}`,
		);
	},

	highlight(message: string): void {
		console.log(
			`${colors.cyan}${colors.bright}${icons.light}  HIGHLIGHT: ${colors.reset}${colors.cyan}${message}${colors.reset}`,
		);
	},

	custom(
		color: keyof typeof colors,
		icon: keyof typeof icons,
		label: string,
		message: string,
	): void {
		console.log(
			`${colors[color]}${colors.bright}${
				icons[icon]
			}  ${label.toUpperCase()}: ${colors.reset}${colors[color]}${message}${
				colors.reset
			}`,
		);
	},

	divider(): void {
		console.log(`${colors.dim}${"─".repeat(50)}${colors.reset}`);
	},
};

export default colorLog;
