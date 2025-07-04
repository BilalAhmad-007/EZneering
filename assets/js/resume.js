// Resume Builder Tool JS

// Utility to create unique IDs for dynamic fields
function uniqueId(prefix = 'id') {
    return prefix + '_' + Math.random().toString(36).substr(2, 9);
}

// State
const resumeState = {
    education: [],
    experience: [],
    projects: [],
    certificates: [],
    achievements: []
};

// DOM Elements
const form = document.getElementById('resume-form');
const preview = document.getElementById('resume-preview');
const eduList = document.getElementById('rb-education-list');
const expList = document.getElementById('rb-experience-list');
const projList = document.getElementById('rb-project-list');
const certList = document.getElementById('rb-certificate-list');
const achList = document.getElementById('rb-achievement-list');

// --- Education ---
function addEducation() {
    const id = uniqueId('edu');
    resumeState.education.push({ id, school: '', degree: '', year: '' });
    renderEducationFields();
    updatePreview();
}

function removeEducation(id) {
    resumeState.education = resumeState.education.filter(e => e.id !== id);
    renderEducationFields();
    updatePreview();
}

function renderEducationFields() {
    eduList.innerHTML = '';
    resumeState.education.forEach((edu, idx) => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <input type="text" placeholder="School/University" value="${edu.school}" onchange="updateEduField('${edu.id}', 'school', this.value)">
            <input type="text" placeholder="Degree/Field" value="${edu.degree}" onchange="updateEduField('${edu.id}', 'degree', this.value)">
            <input type="text" placeholder="Year" value="${edu.year}" onchange="updateEduField('${edu.id}', 'year', this.value)">
            <button type="button" class="remove-btn" onclick="removeEducation('${edu.id}')">Remove</button>
        `;
        eduList.appendChild(div);
    });
}

function updateEduField(id, field, value) {
    const edu = resumeState.education.find(e => e.id === id);
    if (edu) {
        edu[field] = value;
        updatePreview();
    }
}

// --- Experience ---
function addExperience() {
    const id = uniqueId('exp');
    resumeState.experience.push({ id, job: '', company: '', year: '', desc: '' });
    renderExperienceFields();
    updatePreview();
}

function removeExperience(id) {
    resumeState.experience = resumeState.experience.filter(e => e.id !== id);
    renderExperienceFields();
    updatePreview();
}

function renderExperienceFields() {
    expList.innerHTML = '';
    resumeState.experience.forEach((exp, idx) => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <input type="text" placeholder="Job Title" value="${exp.job}" onchange="updateExpField('${exp.id}', 'job', this.value)">
            <input type="text" placeholder="Company" value="${exp.company}" onchange="updateExpField('${exp.id}', 'company', this.value)">
            <input type="text" placeholder="Year" value="${exp.year}" onchange="updateExpField('${exp.id}', 'year', this.value)">
            <textarea placeholder="Description" rows="2" onchange="updateExpField('${exp.id}', 'desc', this.value)">${exp.desc}</textarea>
            <button type="button" class="remove-btn" onclick="removeExperience('${exp.id}')">Remove</button>
        `;
        expList.appendChild(div);
    });
}

function updateExpField(id, field, value) {
    const exp = resumeState.experience.find(e => e.id === id);
    if (exp) {
        exp[field] = value;
        updatePreview();
    }
}

// --- Projects ---
function addProject() {
    const id = uniqueId('proj');
    resumeState.projects.push({ id, title: '', desc: '', link: '' });
    renderProjectFields();
    updatePreview();
}

function removeProject(id) {
    resumeState.projects = resumeState.projects.filter(p => p.id !== id);
    renderProjectFields();
    updatePreview();
}

function renderProjectFields() {
    projList.innerHTML = '';
    resumeState.projects.forEach((proj, idx) => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <input type="text" placeholder="Project Title" value="${proj.title}" onchange="updateProjectField('${proj.id}', 'title', this.value)">
            <input type="text" placeholder="Link (optional)" value="${proj.link}" onchange="updateProjectField('${proj.id}', 'link', this.value)">
            <textarea placeholder="Description" rows="2" onchange="updateProjectField('${proj.id}', 'desc', this.value)">${proj.desc}</textarea>
            <button type="button" class="remove-btn" onclick="removeProject('${proj.id}')">Remove</button>
        `;
        projList.appendChild(div);
    });
}

function updateProjectField(id, field, value) {
    const proj = resumeState.projects.find(p => p.id === id);
    if (proj) {
        proj[field] = value;
        updatePreview();
    }
}

// --- Certificates ---
function addCertificate() {
    const id = uniqueId('cert');
    resumeState.certificates.push({ id, name: '', issuer: '', link: '' });
    renderCertificateFields();
    updatePreview();
}

function removeCertificate(id) {
    resumeState.certificates = resumeState.certificates.filter(c => c.id !== id);
    renderCertificateFields();
    updatePreview();
}

function renderCertificateFields() {
    certList.innerHTML = '';
    resumeState.certificates.forEach((cert, idx) => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <input type="text" placeholder="Certificate Name" value="${cert.name}" onchange="updateCertificateField('${cert.id}', 'name', this.value)">
            <input type="text" placeholder="Issuer" value="${cert.issuer}" onchange="updateCertificateField('${cert.id}', 'issuer', this.value)">
            <input type="text" placeholder="Link (optional)" value="${cert.link}" onchange="updateCertificateField('${cert.id}', 'link', this.value)">
            <button type="button" class="remove-btn" onclick="removeCertificate('${cert.id}')">Remove</button>
        `;
        certList.appendChild(div);
    });
}

function updateCertificateField(id, field, value) {
    const cert = resumeState.certificates.find(c => c.id === id);
    if (cert) {
        cert[field] = value;
        updatePreview();
    }
}

// --- Achievements ---
function addAchievement() {
    const id = uniqueId('ach');
    resumeState.achievements.push({ id, title: '', desc: '' });
    renderAchievementFields();
    updatePreview();
}

function removeAchievement(id) {
    resumeState.achievements = resumeState.achievements.filter(a => a.id !== id);
    renderAchievementFields();
    updatePreview();
}

function renderAchievementFields() {
    achList.innerHTML = '';
    resumeState.achievements.forEach((ach, idx) => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <input type="text" placeholder="Achievement Title" value="${ach.title}" onchange="updateAchievementField('${ach.id}', 'title', this.value)">
            <textarea placeholder="Description (optional)" rows="2" onchange="updateAchievementField('${ach.id}', 'desc', this.value)">${ach.desc}</textarea>
            <button type="button" class="remove-btn" onclick="removeAchievement('${ach.id}')">Remove</button>
        `;
        achList.appendChild(div);
    });
}

function updateAchievementField(id, field, value) {
    const ach = resumeState.achievements.find(a => a.id === id);
    if (ach) {
        ach[field] = value;
        updatePreview();
    }
}

// --- Live Preview ---
function updatePreview() {
    const name = document.getElementById('rb-name').value;
    const title = document.getElementById('rb-title').value;
    const email = document.getElementById('rb-email').value;
    const phone = document.getElementById('rb-phone').value;
    const location = document.getElementById('rb-location').value;
    const summary = document.getElementById('rb-summary').value;
    const skills = document.getElementById('rb-skills').value.split(',').map(s => s.trim()).filter(Boolean);
    const github = document.getElementById('rb-github').value.trim();
    const linkedin = document.getElementById('rb-linkedin').value.trim();

    let html = '';
    html += `<div style="text-align:center; margin-bottom:0.5rem;">`;
    html += `<div class=\"resume-name\">${name || 'Your Name'}</div>`;
    // Social icons
    if (github || linkedin) {
        html += `<div style=\"margin:0.5rem 0 0.7rem 0; display:flex; justify-content:center; gap:1.2rem;\">`;
        if (github) {
            html += `<a href=\"${github}\" target=\"_blank\" rel=\"noopener\" title=\"GitHub\" style=\"display:inline-block;\">` +
                `<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"#181717\"><path d=\"M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z\"/></svg></a>`;
        }
        if (linkedin) {
            html += `<a href=\"${linkedin}\" target=\"_blank\" rel=\"noopener\" title=\"LinkedIn\" style=\"display:inline-block;\">` +
                `<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"#0077B5\"><path d=\"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z\"/></svg></a>`;
        }
        html += `</div>`;
    }
    html += `</div>`;
    html += `<div class=\"resume-contact\">`;
    if (title) html += `<span>${title}</span>`;
    if (email) html += `<span>${email}</span>`;
    if (phone) html += `<span>${phone}</span>`;
    if (location) html += `<span>${location}</span>`;
    html += `</div>`;
    if (summary) html += `<div class=\"resume-section\"><div class=\"resume-section-title\">Summary</div><div class=\"resume-summary\">${summary}</div></div>`;

    // Education
    if (resumeState.education.length) {
        html += `<div class="resume-section"><div class="resume-section-title">Education</div><ul class="resume-list">`;
        resumeState.education.forEach(edu => {
            if (edu.school || edu.degree || edu.year) {
                html += `<li><span class="resume-job-title">${edu.degree || ''}</span> ${edu.school ? 'at ' + edu.school : ''} <span class="resume-date">${edu.year || ''}</span></li>`;
            }
        });
        html += `</ul></div>`;
    }
    // Experience
    if (resumeState.experience.length) {
        html += `<div class="resume-section"><div class="resume-section-title">Experience</div><ul class="resume-list">`;
        resumeState.experience.forEach(exp => {
            if (exp.job || exp.company || exp.year) {
                html += `<li><span class="resume-job-title">${exp.job || ''}</span> ${exp.company ? 'at ' + exp.company : ''} <span class="resume-date">${exp.year || ''}</span><br>${exp.desc ? `<span>${exp.desc}</span>` : ''}</li>`;
            }
        });
        html += `</ul></div>`;
    }
    // Projects
    if (resumeState.projects.length) {
        html += `<div class="resume-section"><div class="resume-section-title">Projects</div><ul class="resume-list">`;
        resumeState.projects.forEach(proj => {
            if (proj.title || proj.desc) {
                html += `<li><span class="resume-job-title">${proj.title || ''}</span>`;
                if (proj.link) html += ` <a href="${proj.link}" target="_blank" rel="noopener" style="color:var(--accent-color);font-size:0.97em;">[Link]</a>`;
                html += `<br>${proj.desc ? `<span>${proj.desc}</span>` : ''}</li>`;
            }
        });
        html += `</ul></div>`;
    }
    // Certificates
    if (resumeState.certificates.length) {
        html += `<div class=\"resume-section\"><div class=\"resume-section-title\">Certificates</div><ul class=\"resume-list\">`;
        resumeState.certificates.forEach(cert => {
            if (cert.name || cert.issuer) {
                html += `<li><span class=\"resume-job-title\">${cert.name || ''}</span>`;
                if (cert.issuer) html += ` <span style=\"color:#888;font-size:0.97em;\">(${cert.issuer})</span>`;
                if (cert.link) html += ` <a href=\"${cert.link}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent-color);font-size:0.97em;\">[Link]</a>`;
                html += `</li>`;
            }
        });
        html += `</ul></div>`;
    }
    // Achievements
    if (resumeState.achievements.length) {
        html += `<div class=\"resume-section\"><div class=\"resume-section-title\">Achievements</div><ul class=\"resume-list\">`;
        resumeState.achievements.forEach(ach => {
            if (ach.title) {
                html += `<li><span class=\"resume-job-title\">${ach.title}</span>`;
                if (ach.desc) html += `<br><span>${ach.desc}</span>`;
                html += `</li>`;
            }
        });
        html += `</ul></div>`;
    }
    // Skills
    if (skills.length) {
        html += `<div class=\"resume-section\"><div class=\"resume-section-title\">Skills</div><ul style=\"margin:0 0 0 1.2em;padding:0;\">`;
        skills.forEach(skill => {
            html += `<li style=\"color:#222;font-size:1em;line-height:1.7;\">${skill}</li>`;
        });
        html += `</ul></div>`;
    }
    preview.innerHTML = html;
}

// --- Form Listeners ---
[...form.querySelectorAll('input, textarea')].forEach(el => {
    el.addEventListener('input', updatePreview);
});

// --- Download as PDF ---
function downloadResumePDF() {
    // Load jsPDF and html2canvas from CDN if not present
    if (typeof window.jspdf === 'undefined' || typeof window.html2canvas === 'undefined') {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', () => {
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', doDownload);
        });
    } else {
        doDownload();
    }
}

function loadScript(src, cb) {
    const s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.body.appendChild(s);
}

function doDownload() {
    const previewPanel = document.querySelector('.resume-preview-panel');
    if (!previewPanel) return;
    window.html2canvas(previewPanel, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        // Fit image to page
        const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
        const imgWidth = canvas.width * ratio;
        const imgHeight = canvas.height * ratio;
        pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, 30, imgWidth, imgHeight);
        pdf.save('resume.pdf');
    });
}

// --- Initial Render ---
renderEducationFields();
renderExperienceFields();
renderProjectFields();
renderCertificateFields();
renderAchievementFields();
updatePreview();

// Expose for inline HTML event handlers
window.addEducation = addEducation;
window.removeEducation = removeEducation;
window.updateEduField = updateEduField;
window.addExperience = addExperience;
window.removeExperience = removeExperience;
window.updateExpField = updateExpField;
window.addProject = addProject;
window.removeProject = removeProject;
window.updateProjectField = updateProjectField;
window.addCertificate = addCertificate;
window.removeCertificate = removeCertificate;
window.updateCertificateField = updateCertificateField;
window.addAchievement = addAchievement;
window.removeAchievement = removeAchievement;
window.updateAchievementField = updateAchievementField;
window.downloadResumePDF = downloadResumePDF; 