const { execSync } = require('child_process');

function getVersionLabel() {
	try {
		const title = execSync('git log -1 --pretty=format:%s').toString().trim();
		if (title.includes('[major]')) return 'major';
		if (title.includes('[minor]')) return 'minor';
		if (title.includes('[patch]')) return 'patch';
		return '';
	} catch (error) {
		console.error('Error getting version label:', error.message);
		return '';
	}
}

const label = getVersionLabel();
console.log(`LABEL=${label}`);
