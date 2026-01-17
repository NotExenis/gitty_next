'use client';

import { useState } from 'react';
import { searchUsers, updateUserRole, getUserTokens, grantProduct, revokeToken, revokeAllUserTokens, User, AdminToken } from '../../actions/admin';
import { FaSearch, FaUserShield, FaTrash, FaPlus, FaKey, FaDesktop, FaClock } from 'react-icons/fa';
import { products } from '../../products/page';

export default function AdminDashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userTokens, setUserTokens] = useState<AdminToken[]>([]);
    const [loading, setLoading] = useState(false);

    // Grant Product Form State
    const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
    const [duration, setDuration] = useState('infinite');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
        setLoading(false);
        setSelectedUser(null);
    };

    const handleSelectUser = async (user: User) => {
        setSelectedUser(user);
        setLoading(true);
        const tokens = await getUserTokens(user.user_id);
        setUserTokens(tokens);
        setLoading(false);
    };

    const handleRoleUpdate = async (newRole: string) => {
        if (!selectedUser) return;
        const res = await updateUserRole(selectedUser.user_id, newRole);
        if (res.success) {
            setSelectedUser({ ...selectedUser, user_role: newRole });
            // Refresh search results to reflect change in list
            setSearchResults(prev => prev.map(u => u.user_id === selectedUser.user_id ? { ...u, user_role: newRole } : u));
        } else {
            alert("Failed to update role");
        }
    };

    const handleGrantProduct = async () => {
        if (!selectedUser) return;
        const res = await grantProduct(selectedUser.user_email, selectedProduct, duration);
        if (res.success) {
            // Refresh tokens
            const tokens = await getUserTokens(selectedUser.user_id);
            setUserTokens(tokens);
        } else {
            alert("Failed to grant product: " + res.message);
        }
    };

    const handleRevokeToken = async (tokenId: number) => {
        if (!confirm("Are you sure you want to delete this token?")) return;
        const res = await revokeToken(tokenId);
        if (res.success) {
            setUserTokens(prev => prev.filter(t => t.id !== tokenId));
        }
    };

    const handleRevokeAll = async () => {
        if (!confirm("Are you sure you want to delete ALL tokens for this user? This cannot be undone.")) return;
        if (!selectedUser) return;
        const res = await revokeAllUserTokens(selectedUser.user_id);
        if (res.success) {
            setUserTokens([]);
        }
    };

    return (
        <main className="min-h-screen pt-24 px-8 pb-12 overflow-x-hidden relative">
            <div className="fixed top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] -z-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                    <FaUserShield className="text-blue-500" />
                    Admin Control Panel
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Search & User List */}
                    <div className="glass p-6 rounded-2xl border border-white/5 h-fit">
                        <form onSubmit={handleSearch} className="mb-6 relative">
                            <input
                                type="text"
                                placeholder="Search email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        </form>

                        <div className="space-y-2">
                            {searchResults.map(user => (
                                <button
                                    key={user.user_id}
                                    onClick={() => handleSelectUser(user)}
                                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${selectedUser?.user_id === user.user_id ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-white/5'}`}
                                >
                                    <div>
                                        <div className={`font-bold text-sm ${selectedUser?.user_id === user.user_id ? 'text-white' : 'text-zinc-300'}`}>{user.user_email}</div>
                                        <div className={`text-xs ${selectedUser?.user_id === user.user_id ? 'text-blue-200' : 'text-zinc-500'}`}>{user.user_role}</div>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded bg-black/20 ${selectedUser?.user_id === user.user_id ? 'text-white' : 'text-zinc-600'}`}>
                                        Select
                                    </div>
                                </button>
                            ))}
                            {searchResults.length === 0 && !loading && (
                                <p className="text-zinc-500 text-center text-sm py-4">No users found.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: User Management */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedUser ? (
                            <>
                                {/* User Info & Role */}
                                <div className="glass p-6 rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                                {selectedUser.user_email}
                                            </h2>
                                            <p className="text-zinc-500 text-sm font-mono mt-1">ID: {selectedUser.user_id}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-zinc-400">Role:</span>
                                            <select
                                                value={selectedUser.user_role}
                                                onChange={(e) => handleRoleUpdate(e.target.value)}
                                                className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-blue-500/50"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="moderator">Moderator</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Grant Product Section */}
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-6">
                                        <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
                                            <FaPlus size={12} className="text-green-400" />
                                            Grant Product
                                        </h3>
                                        <div className="flex gap-2">
                                            <select
                                                value={selectedProduct}
                                                onChange={(e) => setSelectedProduct(e.target.value)}
                                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                            >
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                                <option value="AltManager">AltManager</option>
                                                <option value="Tweaker">Tweaker</option>
                                            </select>

                                            <select
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                className="w-32 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                            >
                                                <option value="infinite">Lifetime</option>
                                                <option value="30d">30 Days</option>
                                                <option value="7d">7 Days</option>
                                            </select>

                                            <button
                                                onClick={handleGrantProduct}
                                                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                                            >
                                                Grant
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tokens List */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-white">Active Tokens</h3>
                                            {userTokens.length > 0 && (
                                                <button onClick={handleRevokeAll} className="text-red-400 hover:text-red-300 text-xs font-bold px-3 py-1 rounded-lg hover:bg-red-500/10 transition-colors">
                                                    Revoke All
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {userTokens.map(token => (
                                                <div key={token.id} className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-white">{token.product_id}</span>
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${token.is_used ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                                {token.is_used ? 'USED' : 'UNUSED'}
                                                            </span>
                                                        </div>
                                                        <div className="font-mono text-zinc-500 text-xs flex items-center gap-2">
                                                            <FaKey size={10} />
                                                            {token.token.substring(0, 16)}...
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs text-zinc-600">
                                                            <span className="flex items-center gap-1">
                                                                <FaDesktop size={10} />
                                                                {token.ip || 'No IP'}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <FaClock size={10} />
                                                                {token.duration}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRevokeToken(token.id)}
                                                        className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                        title="Revoke Token"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            {userTokens.length === 0 && (
                                                <div className="text-zinc-500 text-sm text-center py-6 border border-dashed border-white/10 rounded-xl">
                                                    No tokens found for this user.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="glass p-12 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-zinc-600 mb-6">
                                    <FaUserShield size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Select a User</h2>
                                <p className="text-zinc-400 max-w-sm">Search for a user by email to manage their roles, products, and tokens.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
