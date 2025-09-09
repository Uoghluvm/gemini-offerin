// In a real app, this would come from an API
export const MOCK_MENTORS = [
  { id: 1, name: 'Zhang Wei (张伟)', university: 'Stanford University', major: 'Computer Science', region: 'USA', price: 150, verified: { name: true, school: true }, avatar: 'https://picsum.photos/id/1027/200/200', experience: 'Tsinghua University alumnus, now at Stanford. Specialized in helping students from Chinese universities with their US CS grad school applications.', degree: 'PhD Candidate' },
  { id: 2, name: 'Li Na (李娜)', university: 'London School of Economics', major: 'Finance', region: 'UK', price: 180, verified: { name: true, school: true }, avatar: 'https://picsum.photos/id/1011/200/200', experience: 'Peking University alum, now at LSE. Expert in G5 university applications for finance and economics majors.', degree: 'MSc' },
  { id: 3, name: 'Wang Fang (王芳)', university: 'University of Toronto', major: 'Data Science', region: 'Canada', price: 120, verified: { name: true, school: false }, avatar: 'https://picsum.photos/id/1012/200/200', experience: 'Fudan University graduate, currently studying Data Science in Toronto. Strong background in Canadian university applications.', degree: 'MSc Candidate' },
  { id: 4, name: 'Liu Yang (刘洋)', university: 'ETH Zurich', major: 'Electrical Engineering', region: 'Europe', price: 160, verified: { name: true, school: true }, avatar: 'https://picsum.photos/id/1013/200/200', experience: 'SJTU alumnus, now at ETH Zurich. Focuses on helping engineering students apply to top European technical universities.', degree: 'PhD' },
  { id: 5, name: 'Chen Jing (陈静)', university: 'National University of Singapore', major: 'Business Analytics', region: 'Asia', price: 130, verified: { name: false, school: false }, avatar: 'https://picsum.photos/id/1015/200/200', experience: 'Graduated from Zhejiang University. Familiar with the application process for top business schools in Singapore and Hong Kong.', degree: 'MSc' },
];

export const MOCK_USER = {
  name: 'Alex Chen (Demo Mentor)',
  role: 'mentor',
  avatar: 'https://picsum.photos/id/1005/200/200',
  verified: { name: true, school: true },
  profile: {
    university: 'Carnegie Mellon University',
    major: 'Machine Learning',
    degree: 'PhD Candidate',
    background: 'B.Eng from Shanghai Jiao Tong University. Interned at Google and Microsoft Research. Passionate about helping students navigate the competitive landscape of top-tier CS programs.',
    services: 'Statement of Purpose review, technical interview prep, research interest matching, and comprehensive application strategy.'
  }
};

export const MOCK_PAYMENT_PLAN = {
  total: 9000,
  currency: 'CNY',
  milestones: [
    { id: 1, name: 'Statement of Purpose Draft & Polish', amount: 3000, dueDate: '2024-08-30', status: 'pending' },
    { id: 2, name: 'Resume/CV Writing & Review', amount: 3000, dueDate: '2024-09-30', status: 'locked' },
    { id: 3, name: 'Online Application System Guidance', amount: 3000, dueDate: '2024-10-30', status: 'locked' },
  ]
};
