import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, subDays } from 'date-fns';

export type Log = {
  id: string;
  title: string;
  date: string; // ISO format or YYYY-MM-DD
  score: number; // 1 to 5
  memo: string;
  posterUrl?: string;
  userId?: string;
};

type SortOrder = 'date' | 'score';

interface CineLogState {
  user: { id: string };
  myLogs: Log[];
  friends: string[];
  sortOrder: SortOrder;
  isModalOpen: boolean;
  editingLogId: string | null;
  
  // Actions
  addLog: (log: Omit<Log, 'id'>) => void;
  updateLog: (id: string, log: Partial<Omit<Log, 'id'>>) => void;
  deleteLog: (id: string) => void;
  setSortOrder: (order: SortOrder) => void;
  addFriend: (id: string) => void;
  setModalOpen: (open: boolean) => void;
  setEditingLogId: (id: string | null) => void;
}

const mockDate = (daysAgo: number) => format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');

const MOCK_MY_LOGS: Log[] = [
  {
    id: 'l1',
    title: 'La La Land',
    date: mockDate(2),
    score: 5,
    memo: 'The opening scene is still a masterpiece. A bittersweet ending that always breaks my heart but in a beautiful way.',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'l2',
    title: 'Interstellar',
    date: mockDate(15),
    score: 4,
    memo: 'Hans Zimmer score is incredible. The docking scene in IMAX will forever be etched in my mind.',
    posterUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800',
  },
];

const MOCK_FRIEND_LOGS: Log[] = [
  {
    id: 'f1',
    title: 'Dune: Part Two',
    date: mockDate(1),
    score: 5,
    memo: 'Visually stunning. Denis Villeneuve is a visionary and the sound design is out of this world.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    userId: 'cinephile_99',
  },
  {
    id: 'f2',
    title: 'Everything Everywhere All at Once',
    date: mockDate(5),
    score: 5,
    memo: 'Pure chaos but so emotional.',
    posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&q=80&w=800',
    userId: 'movie_fanatic',
  },
];

export const useCineLogStore = create<CineLogState>()(
  persist(
    (set) => ({
      user: { id: 'my_secret_id_123' },
      myLogs: MOCK_MY_LOGS,
      friends: ['cinephile_99', 'movie_fanatic'],
      friendLogs: MOCK_FRIEND_LOGS,
      sortOrder: 'date',
      isModalOpen: false,
      editingLogId: null,

      addLog: (log) => set((state) => ({
        myLogs: [
          { ...log, id: Math.random().toString(36).substr(2, 9) },
          ...state.myLogs,
        ]
      })),

      updateLog: (id, updatedFields) => set((state) => ({
        myLogs: state.myLogs.map(log => 
          log.id === id ? { ...log, ...updatedFields } : log
        )
      })),

      deleteLog: (id) => set((state) => ({
        myLogs: state.myLogs.filter(log => log.id !== id)
      })),

      setSortOrder: (order) => set({ sortOrder: order }),

      addFriend: (id) => set((state) => {
        if (state.friends.includes(id)) return state;
        return { friends: [...state.friends, id] };
      }),

      setModalOpen: (open) => set({ isModalOpen: open }),

      setEditingLogId: (id) => set({ editingLogId: id }),
    }),
    {
      name: 'cinelog-storage',
      // We don't want to persist modal state or editing ID
      partialize: (state) => ({
        myLogs: state.myLogs,
        sortOrder: state.sortOrder,
        friends: state.friends,
        friendLogs: state.friendLogs,
        user: state.user,
      }),
    }
  )
);
