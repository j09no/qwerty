
// Message Functions - Direct operations without HTTP
interface Message {
  id: number;
  text: string;
  sender: string;
  createdAt: Date;
}

// In-memory storage for messages (will persist to localStorage)
let messagesStore: Message[] = [];
let messageIdCounter = 1;

// Load messages from localStorage on initialization
function loadFromStorage() {
  try {
    const stored = localStorage.getItem('messages');
    if (stored) {
      messagesStore = JSON.parse(stored);
      // Update counter to avoid ID conflicts
      const maxId = Math.max(...messagesStore.map(m => m.id), 0);
      messageIdCounter = maxId + 1;
    }
  } catch (error) {
    console.error('Error loading messages from storage:', error);
  }
}

// Save messages to localStorage
function saveToStorage() {
  try {
    localStorage.setItem('messages', JSON.stringify(messagesStore));
  } catch (error) {
    console.error('Error saving messages to storage:', error);
  }
}

// Initialize storage
loadFromStorage();

export async function getMessages(): Promise<Message[]> {
  return messagesStore.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function createMessage(messageData: { text: string; sender: string }): Promise<Message> {
  const newMessage: Message = {
    id: messageIdCounter++,
    text: messageData.text,
    sender: messageData.sender,
    createdAt: new Date()
  };
  
  messagesStore.push(newMessage);
  saveToStorage();
  
  return newMessage;
}

// File Management Functions
interface FileItem {
  id: number;
  name: string;
  type: "folder" | "pdf" | "image" | "document";
  size?: string;
  path: string;
  createdAt: Date;
}

interface Folder {
  id: number;
  name: string;
  path: string;
  createdAt: Date;
}

// In-memory storage for files and folders
let filesStore: FileItem[] = [];
let foldersStore: Folder[] = [];
let fileIdCounter = 1;
let folderIdCounter = 1;

// Load files and folders from localStorage
function loadFilesFromStorage() {
  try {
    const storedFiles = localStorage.getItem('files');
    const storedFolders = localStorage.getItem('folders');
    
    if (storedFiles) {
      filesStore = JSON.parse(storedFiles);
      const maxFileId = Math.max(...filesStore.map(f => f.id), 0);
      fileIdCounter = maxFileId + 1;
    }
    
    if (storedFolders) {
      foldersStore = JSON.parse(storedFolders);
      const maxFolderId = Math.max(...foldersStore.map(f => f.id), 0);
      folderIdCounter = maxFolderId + 1;
    }
  } catch (error) {
    console.error('Error loading files/folders from storage:', error);
  }
}

// Save files and folders to localStorage
function saveFilesToStorage() {
  try {
    localStorage.setItem('files', JSON.stringify(filesStore));
    localStorage.setItem('folders', JSON.stringify(foldersStore));
  } catch (error) {
    console.error('Error saving files/folders to storage:', error);
  }
}

// Initialize file storage
loadFilesFromStorage();

// File Functions
export async function getFiles(): Promise<FileItem[]> {
  return filesStore;
}

export async function createFile(fileData: { 
  name: string; 
  type: string; 
  size?: string; 
  path: string 
}): Promise<FileItem> {
  const newFile: FileItem = {
    id: fileIdCounter++,
    name: fileData.name,
    type: fileData.type as FileItem['type'],
    size: fileData.size,
    path: fileData.path,
    createdAt: new Date()
  };
  
  filesStore.push(newFile);
  saveFilesToStorage();
  
  return newFile;
}

export async function deleteFile(id: number): Promise<boolean> {
  const initialLength = filesStore.length;
  filesStore = filesStore.filter(file => file.id !== id);
  
  if (filesStore.length < initialLength) {
    saveFilesToStorage();
    return true;
  }
  
  return false;
}

// Folder Functions
export async function getFolders(): Promise<Folder[]> {
  return foldersStore;
}

export async function createFolder(folderData: { 
  name: string; 
  path: string 
}): Promise<Folder> {
  const newFolder: Folder = {
    id: folderIdCounter++,
    name: folderData.name,
    path: folderData.path,
    createdAt: new Date()
  };
  
  foldersStore.push(newFolder);
  saveFilesToStorage();
  
  return newFolder;
}

export async function deleteFolder(id: number): Promise<boolean> {
  const initialLength = foldersStore.length;
  foldersStore = foldersStore.filter(folder => folder.id !== id);
  
  if (foldersStore.length < initialLength) {
    saveFilesToStorage();
    return true;
  }
  
  return false;
}

// Analytics Functions
interface UserStats {
  id: number;
  totalQuestionsSolved: number;
  totalCorrectAnswers: number;
  studyStreak: number;
  lastStudyDate?: Date;
  totalStudyTimeMinutes: number;
}

interface QuizStat {
  id: number;
  date: Date;
  chapterTitle: string;
  subtopicTitle?: string;
  subjectTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}

// In-memory storage for analytics
let userStatsData: UserStats = {
  id: 1,
  totalQuestionsSolved: 1247,
  totalCorrectAnswers: 1098,
  studyStreak: 12,
  lastStudyDate: new Date(),
  totalStudyTimeMinutes: 1260,
};

let quizStatsStore: QuizStat[] = [];
let quizStatIdCounter = 1;

// Load analytics from localStorage
function loadAnalyticsFromStorage() {
  try {
    const storedUserStats = localStorage.getItem('userStats');
    const storedQuizStats = localStorage.getItem('quizStats');
    
    if (storedUserStats) {
      userStatsData = JSON.parse(storedUserStats);
    }
    
    if (storedQuizStats) {
      quizStatsStore = JSON.parse(storedQuizStats);
      const maxId = Math.max(...quizStatsStore.map(s => s.id), 0);
      quizStatIdCounter = maxId + 1;
    }
  } catch (error) {
    console.error('Error loading analytics from storage:', error);
  }
}

// Save analytics to localStorage
function saveAnalyticsToStorage() {
  try {
    localStorage.setItem('userStats', JSON.stringify(userStatsData));
    localStorage.setItem('quizStats', JSON.stringify(quizStatsStore));
  } catch (error) {
    console.error('Error saving analytics to storage:', error);
  }
}

// Initialize analytics storage
loadAnalyticsFromStorage();

// Analytics Functions
export async function getUserStats(): Promise<any> {
  const totalQuestions = 1000; // Mock data
  const totalChapters = 50;
  const totalSubtopics = 200;

  return {
    ...userStatsData,
    totalQuestions,
    totalChapters,
    totalSubtopics,
    recentActivity: [],
    quizStats: quizStatsStore.slice(-10).reverse()
  };
}

export async function createQuizStat(statData: Omit<QuizStat, 'id'>): Promise<QuizStat> {
  const newStat: QuizStat = {
    id: quizStatIdCounter++,
    ...statData,
    date: new Date(statData.date)
  };
  
  quizStatsStore.push(newStat);
  saveAnalyticsToStorage();
  
  return newStat;
}

export async function updateUserStats(stats: Partial<UserStats>): Promise<UserStats> {
  userStatsData = { ...userStatsData, ...stats };
  saveAnalyticsToStorage();
  return userStatsData;
}

// Schedule Functions
interface ScheduleEvent {
  id: number;
  title: string;
  description?: string;
  subjectId: number;
  chapterId?: number;
  startTime: Date;
  endTime: Date;
  isCompleted?: boolean;
}

// In-memory storage for schedule
let scheduleEventsStore: ScheduleEvent[] = [];
let eventIdCounter = 1;

// Load schedule from localStorage
function loadScheduleFromStorage() {
  try {
    const storedEvents = localStorage.getItem('scheduleEvents');
    
    if (storedEvents) {
      scheduleEventsStore = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime)
      }));
      const maxId = Math.max(...scheduleEventsStore.map(e => e.id), 0);
      eventIdCounter = maxId + 1;
    }
  } catch (error) {
    console.error('Error loading schedule from storage:', error);
  }
}

// Save schedule to localStorage
function saveScheduleToStorage() {
  try {
    localStorage.setItem('scheduleEvents', JSON.stringify(scheduleEventsStore));
  } catch (error) {
    console.error('Error saving schedule to storage:', error);
  }
}

// Initialize schedule storage
loadScheduleFromStorage();

// Schedule Functions
export async function getScheduleEvents(): Promise<ScheduleEvent[]> {
  return scheduleEventsStore;
}

export async function getScheduleEventsByDate(date: Date): Promise<ScheduleEvent[]> {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);
  
  return scheduleEventsStore.filter(event => {
    const eventDate = new Date(event.startTime);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === targetDate.getTime();
  });
}

export async function createScheduleEvent(eventData: Omit<ScheduleEvent, 'id'>): Promise<ScheduleEvent> {
  const newEvent: ScheduleEvent = {
    id: eventIdCounter++,
    ...eventData,
    startTime: new Date(eventData.startTime),
    endTime: new Date(eventData.endTime)
  };
  
  scheduleEventsStore.push(newEvent);
  saveScheduleToStorage();
  
  return newEvent;
}

export async function updateScheduleEvent(id: number, eventData: Partial<ScheduleEvent>): Promise<ScheduleEvent | undefined> {
  const eventIndex = scheduleEventsStore.findIndex(event => event.id === id);
  if (eventIndex === -1) return undefined;
  
  const updatedEvent = {
    ...scheduleEventsStore[eventIndex],
    ...eventData,
    ...(eventData.startTime && { startTime: new Date(eventData.startTime) }),
    ...(eventData.endTime && { endTime: new Date(eventData.endTime) })
  };
  
  scheduleEventsStore[eventIndex] = updatedEvent;
  saveScheduleToStorage();
  
  return updatedEvent;
}

export async function deleteScheduleEvent(id: number): Promise<boolean> {
  const initialLength = scheduleEventsStore.length;
  scheduleEventsStore = scheduleEventsStore.filter(event => event.id !== id);
  
  if (scheduleEventsStore.length < initialLength) {
    saveScheduleToStorage();
    return true;
  }
  
  return false;
}

// Chapters Functions
interface Chapter {
  id: number;
  title: string;
  description?: string;
  subject: string;
  subjectId: number;
  totalQuestions: number;
  completedQuestions: number;
  createdAt: Date;
}

interface Subject {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
}

// In-memory storage for chapters and subjects
let chaptersStore: Chapter[] = [];
let subjectsStore: Subject[] = [];
let chapterIdCounter = 1;
let subjectIdCounter = 1;

// Load chapters and subjects from localStorage
function loadChaptersFromStorage() {
  try {
    const storedChapters = localStorage.getItem('chapters');
    const storedSubjects = localStorage.getItem('subjects');
    
    if (storedChapters) {
      chaptersStore = JSON.parse(storedChapters);
      const maxChapterId = Math.max(...chaptersStore.map(c => c.id), 0);
      chapterIdCounter = maxChapterId + 1;
    }
    
    if (storedSubjects) {
      subjectsStore = JSON.parse(storedSubjects);
      const maxSubjectId = Math.max(...subjectsStore.map(s => s.id), 0);
      subjectIdCounter = maxSubjectId + 1;
    }
  } catch (error) {
    console.error('Error loading chapters/subjects from storage:', error);
  }
}

// Save chapters and subjects to localStorage
function saveChaptersToStorage() {
  try {
    localStorage.setItem('chapters', JSON.stringify(chaptersStore));
    localStorage.setItem('subjects', JSON.stringify(subjectsStore));
  } catch (error) {
    console.error('Error saving chapters/subjects to storage:', error);
  }
}

// Initialize chapters storage
loadChaptersFromStorage();

// Chapters Functions
export async function getChapters(): Promise<Chapter[]> {
  return chaptersStore;
}

export async function getChaptersBySubject(subjectId: number): Promise<Chapter[]> {
  // For now, filter by subject name since we don't have subject relationships
  return chaptersStore;
}

export async function createChapter(chapterData: {
  title: string;
  description?: string;
  subject: string;
  subjectId?: number;
}): Promise<Chapter> {
  const newChapter: Chapter = {
    id: chapterIdCounter++,
    title: chapterData.title,
    description: chapterData.description,
    subject: chapterData.subject,
    subjectId: chapterData.subjectId || 1,
    totalQuestions: 0,
    completedQuestions: 0,
    createdAt: new Date()
  };
  
  chaptersStore.push(newChapter);
  saveChaptersToStorage();
  
  return newChapter;
}

export async function updateChapter(id: number, chapterData: Partial<Chapter>): Promise<Chapter | undefined> {
  const chapterIndex = chaptersStore.findIndex(chapter => chapter.id === id);
  if (chapterIndex === -1) return undefined;
  
  const updatedChapter = {
    ...chaptersStore[chapterIndex],
    ...chapterData
  };
  
  chaptersStore[chapterIndex] = updatedChapter;
  saveChaptersToStorage();
  
  return updatedChapter;
}

export async function deleteChapter(id: number): Promise<boolean> {
  const initialLength = chaptersStore.length;
  chaptersStore = chaptersStore.filter(chapter => chapter.id !== id);
  
  if (chaptersStore.length < initialLength) {
    saveChaptersToStorage();
    return true;
  }
  
  return false;
}

// Questions Functions
interface Question {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  difficulty?: string;
  chapterId: number;
  subtopicId?: number;
  createdAt: Date;
}

// In-memory storage for questions
let questionsStore: Question[] = [];
let questionIdCounter = 1;

// Load questions from localStorage
function loadQuestionsFromStorage() {
  try {
    const storedQuestions = localStorage.getItem('questions');
    
    if (storedQuestions) {
      questionsStore = JSON.parse(storedQuestions);
      const maxId = Math.max(...questionsStore.map(q => q.id), 0);
      questionIdCounter = maxId + 1;
    }
  } catch (error) {
    console.error('Error loading questions from storage:', error);
  }
}

// Save questions to localStorage
function saveQuestionsToStorage() {
  try {
    localStorage.setItem('questions', JSON.stringify(questionsStore));
  } catch (error) {
    console.error('Error saving questions to storage:', error);
  }
}

// Initialize questions storage
loadQuestionsFromStorage();

// Questions Functions
export async function getQuestionsByChapter(chapterId: number): Promise<Question[]> {
  return questionsStore.filter(question => question.chapterId === chapterId);
}

export async function getQuestionsBySubtopic(subtopicId: number): Promise<Question[]> {
  return questionsStore.filter(question => question.subtopicId === subtopicId);
}

export async function createQuestion(questionData: Omit<Question, 'id' | 'createdAt'>): Promise<Question> {
  const newQuestion: Question = {
    id: questionIdCounter++,
    ...questionData,
    createdAt: new Date()
  };
  
  questionsStore.push(newQuestion);
  
  // Update chapter question count
  const chapterIndex = chaptersStore.findIndex(c => c.id === questionData.chapterId);
  if (chapterIndex !== -1) {
    chaptersStore[chapterIndex].totalQuestions++;
    saveChaptersToStorage();
  }
  
  saveQuestionsToStorage();
  return newQuestion;
}

export async function createBulkQuestions(questions: Array<Omit<Question, 'id' | 'createdAt'>>): Promise<Question[]> {
  const createdQuestions: Question[] = [];
  
  for (const questionData of questions) {
    const newQuestion: Question = {
      id: questionIdCounter++,
      ...questionData,
      createdAt: new Date()
    };
    
    questionsStore.push(newQuestion);
    createdQuestions.push(newQuestion);
    
    // Update chapter question count
    const chapterIndex = chaptersStore.findIndex(c => c.id === questionData.chapterId);
    if (chapterIndex !== -1) {
      chaptersStore[chapterIndex].totalQuestions++;
    }
  }
  
  saveChaptersToStorage();
  saveQuestionsToStorage();
  return createdQuestions;
}

// Subtopics Functions
interface Subtopic {
  id: number;
  title: string;
  description?: string;
  chapterId: number;
  createdAt: Date;
}

// In-memory storage for subtopics
let subtopicsStore: Subtopic[] = [];
let subtopicIdCounter = 1;

// Load subtopics from localStorage
function loadSubtopicsFromStorage() {
  try {
    const storedSubtopics = localStorage.getItem('subtopics');
    
    if (storedSubtopics) {
      subtopicsStore = JSON.parse(storedSubtopics);
      const maxId = Math.max(...subtopicsStore.map(s => s.id), 0);
      subtopicIdCounter = maxId + 1;
    }
  } catch (error) {
    console.error('Error loading subtopics from storage:', error);
  }
}

// Save subtopics to localStorage
function saveSubtopicsToStorage() {
  try {
    localStorage.setItem('subtopics', JSON.stringify(subtopicsStore));
  } catch (error) {
    console.error('Error saving subtopics to storage:', error);
  }
}

// Initialize subtopics storage
loadSubtopicsFromStorage();

// Subtopics Functions
export async function getSubtopicsByChapter(chapterId: number): Promise<Subtopic[]> {
  return subtopicsStore.filter(subtopic => subtopic.chapterId === chapterId);
}

export async function createSubtopic(subtopicData: {
  title: string;
  description?: string;
  chapterId: number;
}): Promise<Subtopic> {
  const newSubtopic: Subtopic = {
    id: subtopicIdCounter++,
    title: subtopicData.title,
    description: subtopicData.description,
    chapterId: subtopicData.chapterId,
    createdAt: new Date()
  };
  
  subtopicsStore.push(newSubtopic);
  saveSubtopicsToStorage();
  
  return newSubtopic;
}

export async function deleteSubtopic(id: number): Promise<boolean> {
  const initialLength = subtopicsStore.length;
  subtopicsStore = subtopicsStore.filter(subtopic => subtopic.id !== id);
  
  if (subtopicsStore.length < initialLength) {
    saveSubtopicsToStorage();
    return true;
  }
  
  return false;
}

// Quiz Session Functions
interface QuizSession {
  id: number;
  chapterId: number;
  totalQuestions: number;
  currentQuestion: number;
  score: number;
  timeRemaining?: number;
  isCompleted: boolean;
  createdAt: Date;
}

interface QuizAnswer {
  id: number;
  sessionId: number;
  questionId: number;
  selectedAnswer?: number;
  isCorrect?: boolean;
  timeSpent?: number;
  markedForReview?: boolean;
}

// In-memory storage for quiz sessions and answers
let quizSessionsStore: QuizSession[] = [];
let quizAnswersStore: QuizAnswer[] = [];
let quizSessionIdCounter = 1;
let quizAnswerIdCounter = 1;

// Load quiz data from localStorage
function loadQuizFromStorage() {
  try {
    const storedSessions = localStorage.getItem('quizSessions');
    const storedAnswers = localStorage.getItem('quizAnswers');
    
    if (storedSessions) {
      quizSessionsStore = JSON.parse(storedSessions);
      const maxSessionId = Math.max(...quizSessionsStore.map(s => s.id), 0);
      quizSessionIdCounter = maxSessionId + 1;
    }
    
    if (storedAnswers) {
      quizAnswersStore = JSON.parse(storedAnswers);
      const maxAnswerId = Math.max(...quizAnswersStore.map(a => a.id), 0);
      quizAnswerIdCounter = maxAnswerId + 1;
    }
  } catch (error) {
    console.error('Error loading quiz data from storage:', error);
  }
}

// Save quiz data to localStorage
function saveQuizToStorage() {
  try {
    localStorage.setItem('quizSessions', JSON.stringify(quizSessionsStore));
    localStorage.setItem('quizAnswers', JSON.stringify(quizAnswersStore));
  } catch (error) {
    console.error('Error saving quiz data to storage:', error);
  }
}

// Initialize quiz storage
loadQuizFromStorage();

// Quiz Session Functions
export async function createQuizSession(sessionData: {
  chapterId: number;
  totalQuestions: number;
}): Promise<QuizSession> {
  const newSession: QuizSession = {
    id: quizSessionIdCounter++,
    chapterId: sessionData.chapterId,
    totalQuestions: sessionData.totalQuestions,
    currentQuestion: 0,
    score: 0,
    isCompleted: false,
    createdAt: new Date()
  };
  
  quizSessionsStore.push(newSession);
  saveQuizToStorage();
  
  return newSession;
}

export async function getQuizSession(id: number): Promise<QuizSession | undefined> {
  return quizSessionsStore.find(session => session.id === id);
}

export async function updateQuizSession(id: number, sessionData: Partial<QuizSession>): Promise<QuizSession | undefined> {
  const sessionIndex = quizSessionsStore.findIndex(session => session.id === id);
  if (sessionIndex === -1) return undefined;
  
  const updatedSession = {
    ...quizSessionsStore[sessionIndex],
    ...sessionData
  };
  
  quizSessionsStore[sessionIndex] = updatedSession;
  saveQuizToStorage();
  
  return updatedSession;
}

export async function saveQuizAnswer(answerData: Omit<QuizAnswer, 'id'>): Promise<QuizAnswer> {
  const newAnswer: QuizAnswer = {
    id: quizAnswerIdCounter++,
    ...answerData
  };
  
  quizAnswersStore.push(newAnswer);
  saveQuizToStorage();
  
  return newAnswer;
}

export async function getQuizAnswers(sessionId: number): Promise<QuizAnswer[]> {
  return quizAnswersStore.filter(answer => answer.sessionId === sessionId);
}

// Subjects Functions
interface Subject {
  id: number;
  name: string;
  color: string;
}

// Mock subjects data
const mockSubjects: Subject[] = [
  { id: 1, name: "Physics", color: "blue" },
  { id: 2, name: "Chemistry", color: "green" },
  { id: 3, name: "Biology", color: "purple" }
];

export async function getSubjects(): Promise<Subject[]> {
  return mockSubjects;
}
