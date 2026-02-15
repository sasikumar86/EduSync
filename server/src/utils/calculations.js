// Grade mapping based on percentage
const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', gradePoint: 10 };
    if (percentage >= 80) return { grade: 'A', gradePoint: 9 };
    if (percentage >= 70) return { grade: 'B+', gradePoint: 8 };
    if (percentage >= 60) return { grade: 'B', gradePoint: 7 };
    if (percentage >= 50) return { grade: 'C+', gradePoint: 6 };
    if (percentage >= 40) return { grade: 'C', gradePoint: 5 };
    if (percentage >= 33) return { grade: 'D', gradePoint: 4 };
    return { grade: 'F', gradePoint: 0 };
};

// Calculate GPA from marks array
// GPA = Σ(gradePoint × creditHours) / Σ(creditHours)
const calculateGPA = (marks, subjects = []) => {
    if (!marks || marks.length === 0) return 0;

    let totalWeightedPoints = 0;
    let totalCredits = 0;

    marks.forEach((mark) => {
        const percentage = (mark.marksObtained / mark.maxMarks) * 100;
        const { gradePoint } = getGrade(percentage);
        const creditHours = mark.creditHours || 1;
        totalWeightedPoints += gradePoint * creditHours;
        totalCredits += creditHours;
    });

    return totalCredits > 0 ? Math.round((totalWeightedPoints / totalCredits) * 100) / 100 : 0;
};

// Calculate percentage from total marks
const calculatePercentage = (totalMarks, totalMaxMarks) => {
    if (!totalMaxMarks || totalMaxMarks === 0) return 0;
    return Math.round((totalMarks / totalMaxMarks) * 100 * 100) / 100;
};

// Calculate fee pending balance
// Pending = FeeStructure.totalAmount - Σ(paid FeePayments)
const calculatePendingFee = (totalAmount, payments = []) => {
    const totalPaid = payments
        .filter((p) => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
    return Math.max(0, totalAmount - totalPaid);
};

// Calculate net salary
const calculateNetSalary = (salary) => {
    const allowanceTotal = Object.values(salary.allowances || {}).reduce((s, v) => s + (v || 0), 0);
    const deductionTotal = Object.values(salary.deductions || {}).reduce((s, v) => s + (v || 0), 0);
    const gross = salary.basic + allowanceTotal;
    const net = gross - deductionTotal;
    return { grossSalary: gross, netSalary: net };
};

module.exports = { getGrade, calculateGPA, calculatePercentage, calculatePendingFee, calculateNetSalary };
