import { http, HttpResponse } from 'msw';

const budgets = [
  { id: '1', name: 'Vacation Fund', balance: 500, ownerId: 'user1' },
  { id: '2', name: 'Emergency Fund', balance: 1000, ownerId: 'user1' },
];

const goals = [
  { id: '1', name: 'Goal 1', targetAmount: 1000, currentAmount: 500, userId: 'user1' },
  { id: '2', name: 'Goal 2', targetAmount: 2000, currentAmount: 1000, userId: 'user1' },
];

const user = {
  id: 'user1',
  name: 'Test User',
  email: 'test@example.com',
};

export const handlers = [
  http.get('/api/budgets', ({ request }) => {
    const url = new URL(request.url);
    const page = Number.parseInt(url.searchParams.get('page') || '1');
    const limit = Number.parseInt(url.searchParams.get('limit') || '10');
    const pagedBudgets = budgets.slice((page - 1) * limit, page * limit);
    return HttpResponse.json({ budgets: pagedBudgets, totalBudgets: budgets.length });
  }),
  http.get('/api/goals', () => {
    return HttpResponse.json(goals);
  }),
  http.post('/api/goals', () => {
    return HttpResponse.json({ id: '3', name: 'New Goal', targetAmount: 1500, currentAmount: 0, userId: 'user1' });
  }),
  http.get('/api/user', () => {
    return HttpResponse.json(user);
  }),
  // Add a catch-all handler for any other requests
  http.all('*', ({ request }) => {
    console.error(`Unhandled request: ${request.method} ${request.url}`);
    return new HttpResponse(null, { status: 404 });
  }),
];
