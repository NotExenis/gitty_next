'use client';

import React, { useState } from 'react';
import { FaPlus, FaChevronDown, FaCalendar, FaTimes } from 'react-icons/fa';
import { createChangelog } from '@/app/actions/changelogs';
import { useRouter } from 'next/navigation';

export interface ChangelogPost {
    id: number;
    title: string;
    description: string;
    date: string;
}

const ChangelogFeed: React.FC<{ role: string, initialPosts: ChangelogPost[] }> = ({ role, initialPosts }) => {
    const [posts, setPosts] = useState<ChangelogPost[]>(initialPosts);
    const [expandedBlocks, setExpandedBlocks] = useState<number[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // New Post State
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');

    const toggleExpand = (id: number) => {
        setExpandedBlocks(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const handleCreate = async () => {
        if (!newTitle || !newDesc) return;
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('description', newDesc);

        const result = await createChangelog(null, formData);

        if (result.message === 'Success') {
            const newPost: ChangelogPost = {
                id: Date.now(), // Temporary ID until refresh
                title: newTitle,
                date: new Date().toISOString().split('T')[0],
                description: newDesc
            };
            setPosts([newPost, ...posts]);
            setIsCreating(false);
            setNewTitle('');
            setNewDesc('');
            router.refresh(); // Refresh to get real data from DB
        } else {
            alert(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-4xl mx-auto w-full relative">

            {/* Header / Admin Actions */}
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-white tracking-tight">Recent Updates</h2>
                {role === 'admin' && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <FaPlus size={12} />
                        NEW POST
                    </button>
                )}
            </div>

            {/* Creation Modal */}
            {isCreating && (
                <div className="glass p-6 rounded-xl mb-10 border border-blue-500/30 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-blue-200">Create New Changelog</h3>
                        <button onClick={() => setIsCreating(false)} className="text-zinc-500 hover:text-white"><FaTimes /></button>
                    </div>

                    <input
                        type="text"
                        placeholder="Update Title"
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white mb-3 focus:outline-none focus:border-blue-500"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />

                    <textarea
                        placeholder="Description (Supports HTML: <b>, <u>, <br>, etc.)"
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white h-32 mb-4 focus:outline-none focus:border-blue-500 font-mono text-sm"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                    />

                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-bold">Cancel</button>
                        <button
                            onClick={handleCreate}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-bold shadow-lg"
                        >
                            {isSubmitting ? 'Posting...' : 'Post Update'}
                        </button>
                    </div>
                </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
                {posts.map((post) => {
                    const isExpanded = expandedBlocks.includes(post.id);
                    return (
                        <div key={post.id} className="glass rounded-xl border border-white/5 overflow-hidden transition-all duration-300">

                            {/* Header Clickable */}
                            <div
                                onClick={() => toggleExpand(post.id)}
                                className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-between group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono bg-black/30 px-2 py-1 rounded border border-white/5">
                                        <FaCalendar size={10} />
                                        {post.date}
                                    </div>
                                    <h3 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">
                                        {post.title}
                                    </h3>
                                </div>
                                <div className={`text-zinc-600 group-hover:text-blue-400 transition-all duration-300 transform ${isExpanded ? 'rotate-180' : ''}`}>
                                    <FaChevronDown />
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-1">
                                    <div className="h-px w-full bg-white/5 mb-6" />
                                    <div
                                        className="text-zinc-400 leading-relaxed text-sm changelog-content"
                                        dangerouslySetInnerHTML={{ __html: post.description }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}

                {posts.length === 0 && (
                    <div className="text-center text-zinc-500 py-10">
                        No updates yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangelogFeed;
