import React, { useState, useRef, useEffect } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AdDropdown = ({ onEdit, onDelete, onViewDetails }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                title="Options"
            >
                <MoreVertIcon className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails();
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                        <VisibilityIcon className="w-4 h-4 text-blue-500" />
                        View Details
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                        <EditIcon className="w-4 h-4 text-orange-500" />
                        Edit Campaign
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                        onClick={(e) => {
                            console.log("Delete button clicked in AdDropdown");
                            e.stopPropagation();
                            onDelete();
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                    >
                        <DeleteIcon className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdDropdown;
