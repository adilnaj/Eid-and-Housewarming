
import React, { useState } from 'react';
import { ReservationData } from '../types';
import { isCloudEnabled, updateRSVP, deleteRSVP } from '../services/storage';

interface AdminDashboardProps {
  reservations: ReservationData[];
  onClose: () => void;
  onUpdate: (data: ReservationData[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ reservations, onClose, onUpdate }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [editingRsvp, setEditingRsvp] = useState<ReservationData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [deletingRsvpId, setDeletingRsvpId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'celebrate2026') {
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Invalid Access Key');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingRsvpId(id);
  };

  const confirmDelete = async () => {
    if (!deletingRsvpId) return;
    
    // Optimistic update: Remove from UI immediately
    const updatedList = reservations.filter(r => r.id !== deletingRsvpId);
    onUpdate(updatedList);
    setDeletingRsvpId(null);
    
    // Then sync with storage
    try {
      await deleteRSVP(deletingRsvpId);
    } catch (error) {
      console.error("Failed to delete RSVP:", error);
      // Optionally revert UI here if needed
    }
  };

  const handleEditClick = (rsvp: ReservationData) => {
    setEditingRsvp({ ...rsvp });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRsvp) return;

    setIsProcessing(true);
    await updateRSVP(editingRsvp);
    
    const updatedList = reservations.map(r => r.id === editingRsvp.id ? editingRsvp : r);
    onUpdate(updatedList);
    
    setEditingRsvp(null);
    setIsProcessing(false);
  };

  const downloadCSV = () => {
    // Removed Dietary and Notes from CSV as well to match requested changes
    const headers = ['Guest Name', 'Total Count', 'Date Confirmed'];
    const rows = reservations.map(r => [
      r.name,
      r.guests,
      new Date(r.timestamp).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "guest_list.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cloudStatus = isCloudEnabled();

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 bg-white z-[10000] flex items-center justify-center p-6">
        <div className="max-w-xs w-full text-center space-y-8">
          <div className="font-serif italic text-3xl">Host Access</div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              autoFocus
              type="password"
              placeholder="Enter Private Key"
              className="w-full text-center border-b border-gray-200 py-3 outline-none focus:border-[#d4af37] transition-all text-sm tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-400 text-[10px] uppercase tracking-widest">{error}</p>}
            <button className="w-full h-14 bg-[#1a1a1a] text-white rounded-2xl text-[10px] uppercase tracking-[0.4em] tap-active">
              Authorize
            </button>
            <button type="button" onClick={onClose} className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-4">
              Return to Site
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalGuests = reservations.reduce((sum, r) => sum + r.guests, 0);

  return (
    <div className="fixed inset-0 bg-[#fdfcfb] z-[10000] overflow-y-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-start mb-16">
          <div>
            <h1 className="font-serif text-4xl mb-2">Guest List</h1>
            <div className="flex items-center gap-2">
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">
                {reservations.length} RSVPs &bull; {totalGuests} Total Guests
              </p>
              
              {/* Connection Status Badge */}
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${cloudStatus ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${cloudStatus ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                <span className={`text-[8px] uppercase tracking-wider font-bold ${cloudStatus ? 'text-green-700' : 'text-orange-700'}`}>
                  {cloudStatus ? 'Cloud Connected' : 'Local Only'}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-black transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <div className="mb-10 flex gap-4">
          <button 
            onClick={downloadCSV}
            className="px-6 h-12 bg-white border border-gray-100 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm flex items-center gap-3 hover:shadow-md transition-all tap-active"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download CSV
          </button>
        </div>

        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="font-serif italic text-gray-400">No reservations found.</p>
              {!cloudStatus && <p className="text-[10px] text-orange-400 mt-2">Database Disconnected - Showing Local Data Only</p>}
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-100 rounded-3xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">Party Name</th>
                      <th className="px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">Guests</th>
                      <th className="px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">Date</th>
                      <th className="px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-6 py-5">
                          <p className="font-medium text-sm">{res.name}</p>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium">{res.guests}</td>
                        <td className="px-6 py-5 text-[10px] text-gray-400">{new Date(res.timestamp).toLocaleDateString()}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(res);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(res.id);
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingRsvpId && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[10001] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-xl animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
            <h2 className="font-serif text-xl mb-2">Delete Reservation?</h2>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingRsvpId(null)}
                className="flex-1 h-12 border border-gray-100 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 h-12 bg-red-500 text-white rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 transition-colors shadow-sm shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingRsvp && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[10001] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="font-serif text-2xl mb-6">Edit Reservation</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Guest Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#d4af37] transition-colors"
                  value={editingRsvp.name}
                  onChange={(e) => setEditingRsvp({ ...editingRsvp, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Total Guests</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#d4af37] transition-colors"
                  value={editingRsvp.guests}
                  onChange={(e) => setEditingRsvp({ ...editingRsvp, guests: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingRsvp(null)}
                  className="flex-1 h-12 border border-gray-100 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 h-12 bg-[#1a1a1a] text-white rounded-xl text-[10px] uppercase tracking-[0.2em] disabled:opacity-50"
                >
                  {isProcessing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
