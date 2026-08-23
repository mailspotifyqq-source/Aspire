/**
 * Aspire Travels — DS-160 Preparation Worksheet & Excel/CSV Generator
 * Offline data gathering information sheet for visa consultation
 */

import { UsaPortalState } from '../types';

export function downloadDS160InformationSheet(applicant?: Partial<UsaPortalState>) {
  const applicantName = applicant?.fullName || 'Applicant';
  const visaCategory = applicant?.visaService || 'Tourist & Business Visa';
  const travelDate = applicant?.intendedTravelPeriod || 'Upcoming 3-6 Months';
  const email = applicant?.email || '';
  const phone = applicant?.mobileNumber ? `${applicant?.countryCode || '+91'} ${applicant.mobileNumber}` : '';
  const location = applicant?.city && applicant?.state ? `${applicant.city}, ${applicant.state}, ${applicant.country || 'India'}` : 'India';

  const rows: string[][] = [
    ['ASPIRE TRAVELS — USA VISA APPLICATION DS-160 PREPARATION WORKSHEET'],
    ['NOTE: This is an offline preparatory template to help you collect and organize required data prior to official online filing on the CEAC portal (ceac.state.gov). It is NOT an official U.S. government document.'],
    [''],
    ['Reference Case', `ASP-USA-${Date.now().toString().slice(-6)}`, 'Target Destination', 'United States of America (USA)'],
    ['Applicant Full Name', applicantName, 'Selected Visa Service', visaCategory],
    ['Contact Phone', phone || 'Not Provided', 'Contact Email', email || 'Not Provided'],
    ['Applicant Location', location, 'Target Travel Window', travelDate],
    ['Date Generated', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 'Assistance Status', 'DS-160 Filing Support Requested'],
    [''],
    ['Section', 'Field Item', 'Guidance / Description', 'Format / Instructions', 'Applicant Details / Value'],
    ['1. Personal Information', 'Surname / Last Name', 'Last name as printed in machine-readable passport', 'CAPITAL LETTERS', applicantName.includes(' ') ? applicantName.split(' ').slice(-1)[0] : applicantName],
    ['1. Personal Information', 'Given Names / First Name', 'First and middle names as in passport', 'e.g. Rahul', applicantName.includes(' ') ? applicantName.split(' ').slice(0, -1).join(' ') : ''],
    ['1. Personal Information', 'Full Name in Native Alphabet', 'Native script if applicable', 'e.g. Devanagari, Gurmukhi, Tamil, or N/A', 'N/A'],
    ['1. Personal Information', 'Other Names / Aliases', 'Maiden name, religious names, alias', 'Yes / No (Specify if Yes)', 'No'],
    ['1. Personal Information', 'Gender', 'Gender identity', 'Male / Female / Other', ''],
    ['1. Personal Information', 'Marital Status', 'Legal civil status', 'Single / Married / Common-Law / Divorced / Widowed', ''],
    ['1. Personal Information', 'Date of Birth', 'Day, Month, Year of birth', 'DD/MM/YYYY', applicant?.dateOfBirth || ''],
    ['1. Personal Information', 'City & Country of Birth', 'Birth city and state as in passport', 'e.g. New Delhi, India', applicant?.city ? `${applicant.city}, India` : ''],
    ['1. Personal Information', 'Primary Nationality', 'Country of current citizenship', 'e.g. India', applicant?.country || 'India'],
    ['1. Personal Information', 'Other Nationalities / Dual Citizenship', 'Any second passport or residency', 'Yes / No (Specify if Yes)', 'No'],
    ['1. Personal Information', 'National ID Number', 'Aadhaar / Voter ID or N/A', 'Enter number or N/A', ''],
    ['1. Personal Information', 'U.S. Social Security Number', 'Previously issued U.S. SSN (if any)', '9 digits or N/A', 'N/A'],
    ['1. Personal Information', 'U.S. Taxpayer ID Number (ITIN)', 'Previously issued ITIN (if any)', '9 digits or N/A', 'N/A'],
    ['2. Travel Information', 'Purpose of Trip to U.S.', 'Visa Category Classification', 'B1/B2 Visitor / F1 Student / H1B Work', visaCategory],
    ['2. Travel Information', 'Specific Travel Plans Finalized?', 'Do you have exact flight/hotel dates?', 'Yes / No', 'No'],
    ['2. Travel Information', 'Estimated Date of Arrival', 'Target arrival date in the U.S.', 'DD/MM/YYYY', travelDate],
    ['2. Travel Information', 'Intended Length of Stay', 'Duration of visit', 'e.g. 3 Weeks / 1 Month', ''],
    ['2. Travel Information', 'U.S. Stay Address / Hotel', 'Hotel or relative address in U.S.', 'Street, City, State, ZIP', ''],
    ['2. Travel Information', 'Entity Paying for Trip', 'Self-Funded, Employer, or Sponsor', 'Self-Funded / Sponsor / Employer', 'Self-Funded'],
    ['3. Travel Companions', 'Traveling with Others?', 'Family members or colleagues joining', 'Yes / No (Specify names & relation)', applicant?.applicantsCount && applicant.applicantsCount > 1 ? `Yes (${applicant.applicantsCount} Applicants)` : 'No'],
    ['4. Previous U.S. Travel', 'Have you ever visited the U.S. before?', 'Prior entry dates and lengths of stay', 'Yes / No (Provide arrival dates if Yes)', 'No'],
    ['4. Previous U.S. Travel', 'Ever issued a U.S. Visa?', 'Previous visa foil number and date', 'Yes / No (Provide visa foil # if Yes)', 'No'],
    ['4. Previous U.S. Travel', 'Ever refused a U.S. Visa?', 'Any prior 214(b) or 221(g) refusal', 'Yes / No (Provide year & consulate if Yes)', 'No'],
    ['4. Previous U.S. Travel', 'Has anyone filed immigrant petition?', 'USCIS I-130 / I-140 filed on your behalf', 'Yes / No', 'No'],
    ['5. U.S. Point of Contact', 'Contact Person / Organization', 'U.S. Hotel, Conference, or Host Contact', 'Name / Hotel Name / Organization', ''],
    ['5. U.S. Point of Contact', 'Relationship to You', 'Friend / Relative / Business / Hotel', 'Specify relation', ''],
    ['5. U.S. Point of Contact', 'U.S. Phone & Email', 'Contact details of U.S. point of contact', 'Phone / Email address', ''],
    ['6. Family Details', "Father's Full Name & DOB", "Father's surname, given name, birth date", 'Surname, Given Name, DD/MM/YYYY', ''],
    ['6. Family Details', 'Is your father currently in the U.S.?', 'Status in U.S. if applicable', 'Yes / No', 'No'],
    ['6. Family Details', "Mother's Full Name & DOB", "Mother's surname, given name, birth date", 'Surname, Given Name, DD/MM/YYYY', ''],
    ['6. Family Details', 'Is your mother currently in the U.S.?', 'Status in U.S. if applicable', 'Yes / No', 'No'],
    ['6. Family Details', 'Immediate Relatives in U.S.', 'Spouse, fiancé, child, sibling in U.S.', 'Yes / No (Specify legal status if Yes)', 'No'],
    ['7. Employment & Work', 'Primary Employment Status', 'Employed / Business Owner / Student / Retired', 'Specify employment status', ''],
    ['7. Employment & Work', 'Present Employer / Company Name', 'Current employer or business name', 'Official registered entity name', ''],
    ['7. Employment & Work', 'Employer Address & Phone', 'Official office address in India', 'Street, City, State, PIN, Phone', ''],
    ['7. Employment & Work', 'Monthly Gross Income (₹ INR)', 'Current monthly earnings', 'e.g. ₹1,50,000 / month', ''],
    ['7. Employment & Work', 'Brief Job Responsibilities', 'Summary of duties', '2-3 sentences outlining role', ''],
    ['7. Employment & Work', 'Previous Employers (Past 5 Years)', 'Past companies, titles, dates', 'Company, Title, From Date, To Date', ''],
    ['7. Employment & Work', 'Higher Education Details', 'Degrees, colleges, graduation year', 'College Name, Degree, Year', ''],
    [''],
    ['MANDATORY DOCUMENTS CHECKLIST (FOR ASPIRE TRAVELS PRE-SCREENING)'],
    ['[ ] 1. Passport valid for at least 6 months beyond intended travel dates'],
    ['[ ] 2. 2x2 inch (51x51mm) digital square photograph with pure white background'],
    ['[ ] 3. Past 6 months original bank statements stamped by branch with balance certificate'],
    ['[ ] 4. Income Tax Returns (ITR-V) or Form 16 for past 2 financial years'],
    ['[ ] 5. Employer Leave Sanction Letter / No-Objection Certificate (NOC) on letterhead'],
    ['[ ] 6. For Business/Visits: Company invitation letter, conference pass, or family invitation with host proof'],
    [''],
    ['DISCLAIMER: Prepared by Aspire Travels Advisory. This worksheet is for internal consultation and data verification only. Official submission occurs strictly via ceac.state.gov.']
  ];

  const csvContent = rows
    .map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Aspire_Travels_DS160_Information_Sheet_${applicantName.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
