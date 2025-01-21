// ————————————————————————————————————————————————————————————
// EDIT THIS
// 
// Edit this code to customize the homepage!
// 
// The introTitle and introSubtitle variables control the text
// on the homescreen.
// 
// The info variable controls the hidden info menu toggled via
// the button in to top-right corner.
// 
// The githubURL variable is attached to the link in the
// top-right corner.
// ————————————————————————————————————————————————————————————
const introTitle = `Welcome to the Parsons DEMOLAND site!`;
const introSubtitle = `DEMOLAND is an open source website template that allows you to distribute editable code demos (HTML, CSS, JavaScript) entirely within your web browser. By&nbsp;<a href="https://gdwithgd.com/" target="_blank">GD&nbsp;with&nbsp;GD</a>.`;
const info = `
	<p>
		DEMOLAND is an open source website template that allows you to distribute editable code demos (HTML, CSS, JavaScript) entirely within your web browser. This project was created by <a href="https://gdwithgd.com/" target="_blank">GD&nbsp;with&nbsp;GD</a> to make teaching code easier, without the need for subscribing to any premium code distribution services.
	</p>
	<p>
		DEMOLAND is a metaphor for a library containing books featuring chapters of demos. Each book is organized via JSON files, and each demo is split up into two HTML files (content and information). A Node.js file generates the homepage as a static document, while the code editor page fetches demos dynamically. The editor is built using <a href='https://codemirror.net/5/' target="_blank">CodeMirror 5</a>.
	</p>
	<p>
		Interested in launching your own DEMOLAND site? Clone the <a href="https://github.com/gabrieldrozdov/demoland-template" target="_blank">GitHub repository</a> and launch your site via GitHub pages!
	</p>
	<p class="info-credits">
		<strong>CREDITS</strong><br>
		DEMOLAND was developed by <a href="https://gdwithgd.com/" target="_blank">GD with GD</a> / <a href="https://gabrieldrozdov.com/" target="_blank">Gabriel Drozdov</a>. The site features <a href="https://toomuchtype.com/" target="_blank">Limkin by Too Much Type</a> and <a href="https://monaspace.githubnext.com/" target="_blank">Monaspace by GitHub</a>. Text editors are built using <a href='https://codemirror.net/5/' target="_blank">CodeMirror 5</a>. The original DEMOLAND site is available at <a href="https://demoland.gdwithgd.com/" target="_blank">demoland.gdwithgd.com</a>.<br>
		<br>
		If you launch your own DEMOLAND, I’d appreciate it if you left these credits in. And <a href="mailto:gabriel@noreplica.com">sent me an email</a> just to share your work!
	</p>
`;
const githubURL = `https://github.com/parsons/parsons-demoland`;

// ————————————————————————————————————————————————————————————
// DON’T EDIT THIS
// 
// The following code generates the homepage.
// 
// It uses the overview.json file to generate the book index,
// and each book has its own associated JSON in the demos
// folder.
// 
// The book interactive art is automatically generated by
// the home.js file in the assets/scripts folder.
// ————————————————————————————————————————————————————————————

const fs = require('fs');

// Get JSON
const overviewData = require('./overview.json');

// Generate homepage
function generateOverview() {
	// HTML for the overview of all books
	let overview = '';

	// HTML for the individual books
	let books = "";

	// Array containing objects for all demo names, colors, and links
	let allDemos = 'const allDemos = [';

	for (let bookKey of Object.keys(overviewData)) {
		let book = overviewData[bookKey];

		// Build book data
		const bookData = require(`./demos/${bookKey}/${bookKey}.json`);
		let bookChapters = '';
		let totalChapters = 0;
		let totalDemos = 0;
		for (let chapterKey of Object.keys(bookData)) {
			let chapter = bookData[chapterKey];
			totalChapters++;
			
			// Generate demos
			let demos = '';
			let demoIndex = 1;
			for (let demoKey of Object.keys(chapter['demos'])) {
				totalDemos++;
				let demo = chapter['demos'][demoKey];
				demos += `
					<a href="editor/?book=${bookKey}&chapter=${chapterKey}&demo=${demoKey}" class="chapter-demo" style="--primary: ${demo['color']};">
						<div class="chapter-demo-number">${demoIndex}</div>
						<div class="chapter-demo-name">${demo['name']}</div>
					</a>
				`;
				allDemos += `{'name':'${demo['name']}','color':'${demo['color']}','url':'editor/?book=${bookKey}&chapter=${chapterKey}&demo=${demoKey}'},`;
				demoIndex++;
			}

			// Add rainbow class if needed
			let rainbowClass = '';
			if (chapter['color'] == 'rainbow') {
				rainbowClass = ' rainbow';
			}

			// Put it all together
			bookChapters += `
				<section class="chapter ${rainbowClass}" id="${bookKey}-${chapterKey}" style="--primary: ${chapter['color']}">
					<div class="chapter-header">
						<a class="chapter-link" href="editor/?book=${bookKey}&chapter=${chapterKey}&demo=${Object.keys(chapter['demos'])[0]}">
							<div class="chapter-subtitle">
								${chapter['subtitle']}
							</div>
							<h3 class="chapter-title">
								${chapter['title']}
							</h3>
						</a>
						<p class="chapter-desc">
							${chapter['desc']}
						</p>
						<a href="editor/?book=${bookKey}&chapter=${chapterKey}&demo=${Object.keys(chapter['demos'])[0]}" class="chapter-open">Open chapter &nbsp;&nearr;</a>
					</div>
					<div class="chapter-demos">
						${demos}
					</div>
				</section>
			`;
		}

		// Add to book string
		books += `
			<article class="book" data-active="0" id="${bookKey}">
				<header class="book-intro">
					<button class="book-intro-return" onclick="openIntro();">&nwarr;&nbsp; View all books</button>
					<h2 class="book-intro-title">${book['title']}</h2>
					<div class="book-intro-desc">${book['desc']}</div>
				</header>
				<div class="chapter-grid">
					${bookChapters}
				</div>
			</article>
		`;

		// Add book link to overview
		let chaptersPlural = '';
		if (totalChapters > 1) {
			chaptersPlural = 's';
		}
		let demosPlural = '';
		if (totalDemos > 1) {
			demosPlural = 's';
		}
		let shortdesc = '';
		if (book['shortdesc'] != '') {
			shortdesc = `<p class="intro-index-link-shortdesc">${book['shortdesc']}</p>`;
		}
		overview += `
			<a href="#${bookKey}" class="intro-index-link" onclick="openBook('${bookKey}');">
				<div class="intro-index-link-main">
					<h3 class="intro-index-link-title">${book['title']}</h3>
					${shortdesc}
				</div>
				<div class="intro-index-link-info">
					<div>${totalChapters} Chapter${chaptersPlural}</div>
					<div>${totalDemos} Demo${demosPlural}</div>
				</div>
			</a>
		`;
	}

	// Put everything together
	let overviewContent = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>DEMOLAND</title>
			<link rel="icon" type="png" href="./assets/meta/favicon.png">
			<link rel="stylesheet" href="./assets/styles/home.css">
		</head>
		<body>
			<main class="content">
				<div class="toggles">
					<button onclick="toggleInfo()">
						<svg viewBox="0 0 100 100"><rect x="45" y="40" width="10" height="50"/><circle cx="50" cy="20" r="10"/></svg>
					</button>
					<a href="${githubURL}" target="_blank">
						<svg viewBox="0 0 1024 1024">
							<path class="cls-1" d="M512,0C229.12,0,0,229.12,0,512,0,738.56,146.56,929.92,350.08,997.76c25.6,4.48,35.2-10.88,35.2-24.32,0-12.16-.64-52.48-.64-95.36-128.64,23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92,40.32-.64,69.12,37.12,78.72,52.48,46.08,77.44,119.68,55.68,149.12,42.24,4.48-33.28,17.92-55.68,32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8,0-55.68,19.84-101.76,52.48-137.6-5.12-12.8-23.04-65.28,5.12-135.68,0,0,42.88-13.44,140.8,52.48,40.96-11.52,84.48-17.28,128-17.28s87.04,5.76,128,17.28c97.92-66.56,140.8-52.48,140.8-52.48,28.16,70.4,10.24,122.88,5.12,135.68,32.64,35.84,52.48,81.28,52.48,137.6,0,196.48-119.68,240-233.6,252.8,18.56,16,34.56,46.72,34.56,94.72,0,68.48-.64,123.52-.64,140.8,0,13.44,9.6,29.44,35.2,24.32,202.24-67.84,348.8-259.84,348.8-485.76C1024,229.12,794.88,0,512,0Z"/>
						</svg>
					</a>
				</div>
				<div class="info" data-active="0">
					<button class="info-close" onclick="toggleInfo();">
						<svg viewBox="0 0 100 100"><polygon points="81.82 74.749 57.071 50 81.82 25.251 74.749 18.18 50 42.929 25.251 18.18 18.18 25.251 42.929 50 18.18 74.749 25.251 81.82 50 57.071 74.749 81.82 81.82 74.749"/></svg>
					</button>
					${info}
				</div>

				<div class="intro">
					<div class="intro-content">
						<header class="intro-header">
							<h1 class="intro-title">${introTitle}</h1>
							<p class="intro-subtitle">${introSubtitle}</p>
						</header>
						<nav class="intro-index">
							<h2 class="intro-index-title">
								<svg viewBox="0 0 100 100"><path d="m25,5c-5.52,0-10,4.48-10,10v70c0,5.52,4.48,10,10,10h60V5H25Zm50,80H28c-2.76,0-5-2.24-5-5s2.24-5,5-5h47v10Zm0-20H28V15h47v50Z"/><rect x="38" y="25" width="27" height="10"/></svg>
								<span>Select a book</span>
							</h2>
							${overview}
						</nav>
					</div>
					<div class="intro-books-container"><div class="intro-books"></div></div>
				</div>

				${books}
			</main>

			<script src="assets/scripts/all-demos.js"></script>
			<script src="assets/scripts/home.js"></script>
		</body>
		</html>
	`;

	// Create work file
	fs.writeFile(`index.html`, overviewContent, err => {
		if (err) {
			console.error(err);
		}
	});

	// Create file containing all demo names
	fs.writeFile(`./assets/scripts/all-demos.js`, allDemos+']', err => {
		if (err) {
			console.error(err);
		}
	});
}
generateOverview();