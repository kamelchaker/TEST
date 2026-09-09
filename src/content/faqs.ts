import type { Faq } from "./types";

const programFaq = (id: string, question: string, answer: string): Faq => ({
  id,
  scope: "program",
  question,
  answer,
});

export const faqs: Faq[] = [
  // Early Learners
  programFaq("el-toilet", "Is toilet training required?", "Toilet training is not required in Early Learners."),
  programFaq("el-meals", "What about meals, snacks and rest?", "Meals, snack and rest follow the program's daily schedule."),
  programFaq("el-supplies", "What clothing and supplies are needed?", "A supplies list is shared with enrolled families."),
  programFaq("el-teachers", "How do we hear from teachers?", "Families hear regularly about what their child is working on and what comes next."),
  // Preschool
  programFaq("ps-toilet", "Is toilet training required?", "Children in progress are supported."),
  programFaq("ps-meals", "What about meals, snacks and rest?", "Meals, snack and rest follow the program's daily schedule."),
  programFaq("ps-supplies", "What clothing and supplies are needed?", "A supplies list is shared with enrolled families."),
  programFaq("ps-teachers", "How do we hear from teachers?", "Families hear regularly about what their child is working on and what comes next."),
  // Pre-Kindergarten
  programFaq("pk-toilet", "Is toilet training required?", "Toilet training is required."),
  programFaq("pk-meals", "What about meals, snacks and rest?", "Meals, snack and quiet time follow the daily schedule."),
  programFaq("pk-supplies", "What clothing and supplies are needed?", "A supplies list is shared with enrolled families."),
  programFaq("pk-teachers", "How do we hear from teachers?", "Families hear regularly about what their child is working on and what comes next."),
  // Kindergarten
  programFaq("k-meals", "What about meals and snacks?", "Meals and snack follow the daily schedule."),
  programFaq("k-supplies", "What supplies or uniform are needed?", "A supplies list is shared with enrolled families."),
  programFaq("k-homework", "Is there homework?", "Homework practice is shared with families at the start of the year."),
  programFaq("k-teachers", "How do we hear from teachers?", "Families hear regularly about what their child is working on and what comes next."),
  // Extended Learning
  programFaq("ext-signup", "How do we sign up or make changes?", "Extended learning places are arranged with the school office."),
  programFaq("ext-late", "What happens at late pick-up?", "Late pick-up procedures are shared with enrolled families."),
  programFaq("ext-teachers", "Are the teachers the same as the school day?", "Extended learning is staffed by familiar teachers."),
  // Admissions
  { id: "adm-placement", scope: "admissions", question: "Which program will my child be placed in?", answer: "Placement follows date of birth against the eligibility cutoff for the academic year." },
  { id: "adm-tour", scope: "admissions", question: "Do we have to tour before applying?", answer: "No, but most families do. It answers more than a page can." },
  { id: "adm-open", scope: "admissions", question: "When do applications open?", answer: "Application windows are published for each academic year." },
  { id: "adm-waitlist", scope: "admissions", question: "Is there a waitlist?", answer: "Waitlist availability is published per program." },
  { id: "adm-tuition", scope: "admissions", question: "What does tuition include?", answer: "Tuition and fee information is available from our admissions team for the applicable academic year." },
  { id: "adm-arabic", scope: "admissions", question: "Does my child need to speak Arabic or have Qur'an experience?", answer: "No. Every program starts from listening and exposure and builds from where each child is." },
  { id: "adm-toilet", scope: "admissions", question: "Is toilet training required?", answer: "It varies by program." },
  { id: "adm-extended", scope: "admissions", question: "Can we add Before or After School later?", answer: "Yes, subject to availability." },
  // Families
  { id: "fam-pack", scope: "families", question: "What do we pack each day?", answer: "Clothing, supplies and snack guidance is shared per program." },
  { id: "fam-teachers", scope: "families", question: "How do we hear from teachers?", answer: "Families hear regularly about what their child is working on and what comes next." },
  { id: "fam-arrival", scope: "families", question: "What are arrival and dismissal like?", answer: "Arrival and dismissal routines are shared with enrolled families." },
];
