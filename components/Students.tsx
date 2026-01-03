
import { Student, ClassRoom, SchoolYear, AcademicRecord, Grade, Teacher } from '../types';
import { Search, Plus, Edit, CheckCircle2, AlertTriangle, Save, User, ScrollText, X, Fingerprint, Calendar, School, Droplets, BookOpen, Flame, Star, Phone, GitMerge, AlertCircle } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_SAINTS } from '../constants';

interface StudentsProps {
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
    classes: ClassRoom[];
    years: SchoolYear[];
    records: AcademicRecord[];
    grades: Grade[];
    currentUser: Teacher | null;
}

export const Students: React.FC<StudentsProps> = ({ students, setStudents, classes, years, records, grades, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const isAdmin = currentUser?.role === 'ADMIN';

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedClass, setSelectedClass] = useState('');

  const allowedClasses = useMemo(() => {
      if (!currentUser) return [];
      if (isAdmin) return classes;
      const teacherName = `${currentUser.saintName} ${currentUser.fullName}`;
      return classes.filter(c => 
          (c.mainTeacher && c.mainTeacher.includes(teacherName)) || 
          (c.assistants && c.assistants.includes(teacherName))
      );
  }, [classes, currentUser, isAdmin]);

  useEffect(() => {
     const active = years.find(y => y.isActive);
     const activeYearId = active ? active.id : (years[0]?.id || '');
     setSelectedYear(activeYearId);

     if (!isAdmin && activeYearId) {
         const myClassesInYear = allowedClasses.filter(c => c.yearId === activeYearId);
         if (myClassesInYear.length > 0) {
             setSelectedClass(myClassesInYear[0].id);
         } else {
             setSelectedClass('');
         }
     }
  }, [years, isAdmin, allowedClasses]);

  const [showModal, setShowModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Form states
  const [inputId, setInputId] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputDob, setInputDob] = useState('');
  const [inputGender, setInputGender] = useState<'Male' | 'Female'>('Male');
  const [inputStatus, setInputStatus] = useState<'ACTIVE' | 'TRANSFERRED' | 'DROPPED'>('ACTIVE');
  const [saintInput, setSaintInput] = useState('');
  const [inputBirthPlace, setInputBirthPlace] = useState('');
  const [inputClassId, setInputClassId] = useState(''); 
  const [inputFatherName, setInputFatherName] = useState('');
  const [inputMotherName, setInputMotherName] = useState('');
  const [inputFatherPhone, setInputFatherPhone] = useState('');
  const [inputMotherPhone, setInputMotherPhone] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [inputBaptismDate, setInputBaptismDate] = useState('');
  const [inputBaptismBy, setInputBaptismBy] = useState('');
  const [inputBaptismSponsor, setInputBaptismSponsor] = useState('');
  const [inputBaptismPlace, setInputBaptismPlace] = useState('');
  const [inputEucharistDate, setInputEucharistDate] = useState('');
  const [inputEucharistBy, setInputEucharistBy] = useState('');
  const [inputEucharistPlace, setInputEucharistPlace] = useState('');
  const [inputConfirmationDate, setInputConfirmationDate] = useState('');
  const [inputConfirmationBy, setInputConfirmationBy] = useState('');
  const [inputConfirmationSponsor, setInputConfirmationSponsor] = useState('');
  const [inputConfirmationPlace, setInputConfirmationPlace] = useState('');
  const [inputOathDate, setInputOathDate] = useState('');
  const [inputNote, setInputNote] = useState('');

  const [showSaintSuggestions, setShowSaintSuggestions] = useState(false);

  const classesInYear = useMemo(() => allowedClasses.filter(c => c.yearId === selectedYear), [allowedClasses, selectedYear]);
  const availableClasses = useMemo(() => selectedGrade === 'all' ? classesInYear : classesInYear.filter(c => c.gradeId === selectedGrade), [classesInYear, selectedGrade]);
  const modalAvailableClasses = useMemo(() => classesInYear, [classesInYear]);

  // Duplicate detection logic
  const potentialDuplicates = useMemo(() => {
    if (!inputName || !inputDob || selectedStudent) return [];
    const cleanName = inputName.trim().toLowerCase();
    return students.filter(s => 
        s.fullName.trim().toLowerCase() === cleanName && 
        s.dob === inputDob
    );
  }, [inputName, inputDob, students, selectedStudent]);

  useEffect(() => {
      if (showModal) {
          if (selectedStudent) {
              setInputId(selectedStudent.id); setInputName(selectedStudent.fullName); setInputDob(selectedStudent.dob); setSaintInput(selectedStudent.saintName); setInputGender(selectedStudent.gender); setInputStatus(selectedStudent.status); setInputBirthPlace(selectedStudent.birthPlace || ''); setInputClassId(selectedStudent.classId); setInputFatherName(selectedStudent.fatherName || ''); setInputMotherName(selectedStudent.motherName || ''); setInputFatherPhone(selectedStudent.fatherPhone || ''); setInputMotherPhone(selectedStudent.motherPhone || ''); setInputAddress(selectedStudent.address || ''); setInputBaptismDate(selectedStudent.baptismDate || ''); setInputBaptismBy(selectedStudent.baptismBy || ''); setInputBaptismSponsor(selectedStudent.baptismSponsor || ''); setInputBaptismPlace(selectedStudent.baptismPlace || ''); setInputEucharistDate(selectedStudent.eucharistDate || ''); setInputEucharistBy(selectedStudent.eucharistBy || ''); setInputEucharistPlace(selectedStudent.eucharistPlace || ''); setInputConfirmationDate(selectedStudent.confirmationDate || ''); setInputConfirmationBy(selectedStudent.confirmationBy || ''); setInputConfirmationSponsor(selectedStudent.confirmationSponsor || ''); setInputConfirmationPlace(selectedStudent.confirmationPlace || ''); setInputOathDate(selectedStudent.confirmationOathDate || ''); setInputNote(selectedStudent.note || '');
          } else {
              const prefix = selectedYear.slice(2, 4);
              const yearStudents = students.filter(s => s.id.startsWith(prefix));
              const nextNum = (yearStudents.length > 0 ? Math.max(...yearStudents.map(s => parseInt(s.id.slice(2)))) + 1 : 1).toString().padStart(4, '0');
              setInputId(`${prefix}${nextNum}`); setInputName(''); setInputDob(''); setSaintInput(''); setInputGender('Male'); setInputStatus('ACTIVE'); setInputClassId(selectedClass || (modalAvailableClasses[0]?.id || '')); setInputBirthPlace(''); setInputFatherName(''); setInputMotherName(''); setInputFatherPhone(''); setInputMotherPhone(''); setInputAddress(''); setInputBaptismDate(''); setInputBaptismBy(''); setInputBaptismSponsor(''); setInputBaptismPlace(''); setInputEucharistDate(''); setInputEucharistBy(''); setInputEucharistPlace(''); setInputConfirmationDate(''); setInputConfirmationBy(''); setInputConfirmationSponsor(''); setInputConfirmationPlace(''); setInputOathDate(''); setInputNote('');
          }
      }
  }, [showModal, selectedStudent, selectedYear, students, selectedClass, modalAvailableClasses]);

  const filteredSaints = useMemo(() => MOCK_SAINTS.filter(s => s.name.toLowerCase().includes(saintInput.toLowerCase())), [saintInput]);

  const filteredStudents = useMemo(() => {
    const list = students.filter(student => {
        const matchSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || student.saintName.toLowerCase().includes(searchTerm.toLowerCase());
        let validClassIds: string[] = [];
        if (selectedClass !== 'all' && selectedClass !== '') {
            validClassIds = [selectedClass];
        } else {
            validClassIds = availableClasses.map(c => c.id);
        }
        return matchSearch && validClassIds.includes(student.classId);
    });
    return list.sort((a, b) => (a.fullName.split(' ').pop() || '').localeCompare(b.fullName.split(' ').pop() || '', 'vi'));
  }, [students, searchTerm, selectedClass, availableClasses]);

  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || 'N/A';

  const getClassColor = (classId: string) => {
      const cls = classes.find(c => c.id === classId);
      if (!cls) return 'bg-slate-100 text-slate-700 border-slate-200';
      switch (cls.gradeId) {
          case 'g1': return 'bg-pink-100 text-pink-700 border-pink-200';
          case 'g2': return 'bg-green-100 text-green-700 border-green-200';
          case 'g3': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'g4': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          default: return 'bg-slate-100 text-slate-700 border-slate-200';
      }
  };

  const splitName = (fullName: string) => {
      const parts = fullName.trim().split(' ');
      const firstName = parts.pop() || '';
      const lastName = parts.join(' ');
      return { lastName, firstName };
  };

  const handleSaveStudent = () => {
    if (!inputName || !inputDob || !saintInput) return alert("Vui lòng nhập đầy đủ: Tên thánh, họ tên, ngày sinh.");
    
    // Check for duplicates before saving (only for new entries)
    if (!selectedStudent && potentialDuplicates.length > 0) {
        setShowDuplicateModal(true);
        return;
    }
    
    executeSave();
  };

  const executeSave = () => {
    const studentData: Student = { id: inputId, fullName: inputName, dob: inputDob, saintName: saintInput, gender: inputGender, status: inputStatus, classId: inputClassId, parish: 'Gx. Tân Thành', birthPlace: inputBirthPlace, fatherName: inputFatherName, motherName: inputMotherName, fatherPhone: inputFatherPhone, motherPhone: inputMotherPhone, address: inputAddress, baptismDate: inputBaptismDate, baptismBy: inputBaptismBy, baptismSponsor: inputBaptismSponsor, baptismPlace: inputBaptismPlace, eucharistDate: inputEucharistDate, eucharistBy: inputEucharistBy, eucharistPlace: inputEucharistPlace, confirmationDate: inputConfirmationDate, confirmationBy: inputConfirmationBy, confirmationSponsor: inputConfirmationSponsor, confirmationPlace: inputConfirmationPlace, confirmationOathDate: inputOathDate, note: inputNote };
    if (selectedStudent) {
        setStudents(prev => prev.map(s => s.id === selectedStudent.id ? studentData : s));
        showToast("Đã cập nhật hồ sơ!");
    } else {
        setStudents(prev => [...prev, studentData]);
        showToast(`Đã thêm học viên: ${inputId}`);
    }
    setShowModal(false);
    setShowDuplicateModal(false);
  };

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
        case 'ACTIVE': return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Đang học</span>;
        case 'TRANSFERRED': return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">Chuyển xứ</span>;
        case 'DROPPED': return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Nghỉ học</span>;
        default: return null;
    }
  };

  const currentYearName = years.find(y => y.id === selectedYear)?.name || '---';

  return (
    <div className="p-4 md:p-6 h-screen flex flex-col relative bg-slate-50">
      {toast && (
        <div className="fixed top-6 right-6 z-[300] animate-slide-in">
           <div className={`text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border ${toast.type === 'success' ? 'bg-emerald-600 border-emerald-500/50' : 'bg-red-600 border-red-500/50'}`}>
              <CheckCircle2 size={24} /> <span className="font-bold text-lg">{toast.message}</span>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
        <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">Học viên</h2>
            <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-base font-bold border border-blue-200">{filteredStudents.length} hồ sơ</div>
        </div>
        <button onClick={() => { setSelectedStudent(null); setShowModal(true); }} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg font-bold transition-all active:scale-95 text-base">
            <Plus size={24} /> Thêm mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-5 flex flex-col xl:flex-row gap-4 items-center">
        {isAdmin ? (
            <div className="flex flex-col md:flex-row flex-wrap gap-3 items-stretch md:items-center w-full md:w-auto">
                <select className="px-4 py-3 rounded-xl border border-slate-300 font-bold bg-slate-50 text-base min-w-[140px]" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {years.map(y => <option key={y.id} value={y.id}>{y.name.replace('Năm học ', '')}</option>)}
                </select>
                <div className="flex gap-2">
                    <select className="flex-1 px-4 py-3 rounded-xl border border-slate-300 font-bold bg-slate-50 text-base" value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
                        <option value="all">Tất cả Khối</option>
                        {grades.map(g => <option key={g.id} value={g.id}>{g.name.replace('Khối ', '')}</option>)}
                    </select>
                    <select className="flex-1 px-4 py-3 rounded-xl border border-slate-300 font-bold bg-slate-50 text-blue-800 text-base" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                        <option value="all">Tất cả Lớp</option>
                        {availableClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>
        ) : (
            <div className="flex items-center gap-4">
                <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 text-base font-bold text-slate-700">
                    <Calendar size={18} className="text-slate-400"/> {currentYearName}
                </div>
                <div className="bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100 flex items-center gap-2 text-base font-bold text-blue-800">
                    <School size={18} className="text-blue-500"/> {getClassName(selectedClass)}
                </div>
            </div>
        )}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input type="text" placeholder="Tìm theo tên thánh, họ tên..." className="w-full pl-14 pr-6 py-3.5 rounded-xl border border-slate-300 outline-none focus:ring-4 focus:ring-blue-100 font-bold text-base shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>
      </div>

      {/* Table - Optimized Columns */}
      <div className="flex-1 overflow-hidden flex flex-col bg-slate-50 md:bg-white md:rounded-3xl md:shadow-lg md:border md:border-slate-200">
        
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar h-full relative">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0 z-10 shadow-sm border-b border-slate-300 text-[13px]">
              <tr>
                <th className="px-2 py-4 w-[40px] text-center">#</th>
                <th className="px-2 py-4 w-[80px]">Mã SV</th>
                <th className="px-2 py-4 w-[110px]">Tên thánh</th>
                <th className="px-3 py-4 w-[220px]">Họ và tên</th>
                <th className="px-2 py-4 w-[110px] text-left">Ngày sinh</th>
                <th className="px-2 py-4 w-[75px] text-left">G.Tính</th>
                <th className="px-3 py-4 w-[150px] text-left">SĐT liên hệ</th>
                <th className="px-2 py-4 w-[110px]">Lớp</th>
                <th className="px-2 py-4 text-center w-[110px]">Tình trạng</th>
                <th className="px-2 py-4 text-center w-[60px]">Sửa</th>
              </tr>
            </thead>
            <tbody className="text-base text-slate-800 divide-y divide-slate-100">
              {filteredStudents.map((s, index) => {
                const { lastName, firstName } = splitName(s.fullName);
                return (
                <tr key={s.id} className="hover:bg-blue-50/50 transition-all group">
                  <td className="px-2 py-3 text-center text-slate-400 font-bold text-sm">{index + 1}</td>
                  <td className="px-2 py-3 font-mono text-sm font-bold text-slate-500">{s.id}</td>
                  <td className="px-2 py-3 font-bold text-slate-700 text-lg">{s.saintName}</td>
                  <td className="px-3 py-3 text-lg"><span className="text-slate-500 font-medium">{lastName}</span> <span className="font-bold text-slate-900">{firstName}</span></td>
                  <td className="px-2 py-3 text-left font-bold text-slate-600">{new Date(s.dob).toLocaleDateString('vi-VN')}</td>
                  <td className="px-2 py-3 text-left"><span className={`text-base font-bold ${s.gender === 'Male' ? 'text-blue-600' : 'text-pink-600'}`}>{s.gender === 'Male' ? 'Nam' : 'Nữ'}</span></td>
                  <td className="px-3 py-3 text-left">
                    <div className="flex flex-col gap-0.5 text-sm font-bold text-blue-700">
                        {s.fatherPhone && <span className="whitespace-nowrap truncate">B: {s.fatherPhone}</span>}
                        {s.motherPhone && <span className="whitespace-nowrap truncate">M: {s.motherPhone}</span>}
                        {!s.fatherPhone && !s.motherPhone && <span className="text-slate-300">--</span>}
                    </div>
                  </td>
                  <td className="px-2 py-3"><span className={`px-2 py-0.5 rounded-lg text-[10px] font-black whitespace-nowrap shadow-sm border ${getClassColor(s.classId)}`}>{getClassName(s.classId)}</span></td>
                  <td className="px-2 py-3 text-center">{getStatusBadge(s.status)}</td>
                  <td className="px-2 py-3 text-center">
                    <button onClick={() => { setSelectedStudent(s); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all scale-105">
                        <Edit size={22} />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden overflow-y-auto h-full space-y-3 p-2 pb-24">
            {filteredStudents.map(s => (
                <div key={s.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-2 relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${s.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className="flex justify-between items-start pl-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded border">#{s.id}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getClassColor(s.classId)}`}>{getClassName(s.classId)}</span>
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg leading-tight"><span className="text-slate-500 text-sm font-medium block">{s.saintName}</span>{s.fullName}</h3>
                        </div>
                        <button onClick={() => { setSelectedStudent(s); setShowModal(true); }} className="p-3 bg-slate-50 text-blue-600 rounded-xl border border-slate-200 hover:bg-blue-50 active:scale-95 transition-all"><Edit size={24} /></button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Main Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-[250] flex items-center justify-center p-2 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-100 rounded-[2rem] shadow-2xl w-full max-w-[96vw] h-[94vh] flex flex-col overflow-hidden border border-slate-300 animate-scale-in relative">
            
            {/* Modal Header */}
            <div className="px-8 py-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-[310] shrink-0">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-blue-600 text-white rounded-3xl flex items-center justify-center font-bold shadow-blue-200 shadow-lg">
                    {selectedStudent ? <Fingerprint size={32}/> : <Plus size={32}/>}
                 </div>
                 <div>
                    <h3 className="font-black text-2xl text-slate-800 tracking-tight leading-none mb-1.5">{selectedStudent ? 'Cập nhật hồ sơ học viên' : 'Thêm học viên mới'}</h3>
                    <p className="text-xs font-mono text-slate-500 font-bold flex items-center gap-2 leading-none">Mã định danh: <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 border font-black">{inputId}</span></p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                  <button onClick={() => setShowModal(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 text-base transition-all flex items-center gap-2 active:scale-95"><X size={22}/> Hủy bỏ</button>
                  <button onClick={handleSaveStudent} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 flex items-center gap-2 text-base active:scale-95 transition-all"><Save size={22}/> Lưu hồ sơ</button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                
                {/* LEFT: IDENTITY (42%) */}
                <div className="w-full md:w-[42%] bg-white border-r border-slate-200 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-5">
                    
                    {/* Identity Section */}
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-base text-blue-700 mb-5 flex items-center gap-2 border-b border-blue-100 pb-2"><User size={20}/> Thông tin học viên</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12">
                                    <label className="label-tiny">Lớp học hiện tại</label>
                                    <select className="form-input font-bold text-blue-700 py-3 text-lg" value={inputClassId} onChange={(e) => setInputClassId(e.target.value)}>
                                        <option value="">-- Chọn lớp học --</option>
                                        {modalAvailableClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-5">
                                    <label className="label-tiny">Tên thánh <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input className="form-input font-bold py-3 text-lg" value={saintInput} onChange={(e) => {setSaintInput(e.target.value); setShowSaintSuggestions(true);}} onFocus={() => setShowSaintSuggestions(true)} onBlur={() => setTimeout(() => setShowSaintSuggestions(false), 200)} placeholder="Giuse..." />
                                        {showSaintSuggestions && filteredSaints.length > 0 && (
                                            <div className="absolute z-[400] w-full bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-52 overflow-y-auto mt-1 custom-scrollbar">
                                                {filteredSaints.map(s => (<div key={s.id} className="p-3 hover:bg-blue-50 cursor-pointer text-base font-bold border-b last:border-0" onClick={() => {setSaintInput(s.name); setShowSaintSuggestions(false);}}>{s.name}</div>))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-7">
                                    <label className="label-tiny">Họ và tên học viên <span className="text-red-500">*</span></label>
                                    <input className="form-input font-bold text-slate-800 py-3 text-lg" value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="Nguyễn Văn An" />
                                </div>
                                <div className="col-span-6">
                                    <label className="label-tiny">Ngày sinh <span className="text-red-500">*</span></label>
                                    <input type="date" className="form-input font-bold text-blue-700 py-3 text-lg" value={inputDob} onChange={(e) => setInputDob(e.target.value)}/>
                                </div>
                                <div className="col-span-3">
                                    <label className="label-tiny">Giới tính</label>
                                    <select className="form-input py-3 text-lg font-bold" value={inputGender} onChange={(e) => setInputGender(e.target.value as any)}>
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                    </select>
                                </div>
                                <div className="col-span-3">
                                    <label className="label-tiny">Tình trạng</label>
                                    <select className="form-input font-bold text-emerald-700 py-3 text-lg" value={inputStatus} onChange={(e) => setInputStatus(e.target.value as any)}>
                                        <option value="ACTIVE">Học</option>
                                        <option value="DROPPED">Nghỉ</option>
                                    </select>
                                </div>
                                <div className="col-span-12">
                                    <label className="label-tiny">Nơi sinh</label>
                                    <input className="form-input py-3 text-lg font-medium" value={inputBirthPlace} onChange={(e) => setInputBirthPlace(e.target.value)} placeholder="TP. Hồ Chí Minh..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Family Section */}
                    <div className="bg-orange-50/50 p-5 rounded-3xl border border-orange-100 shadow-sm">
                        <h4 className="font-bold text-base text-orange-700 mb-5 flex items-center gap-2 border-b border-orange-100 pb-2"><Phone size={18}/> Liên hệ gia đình</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-7"><label className="label-tiny">Họ tên bố</label><input className="form-input py-3 text-lg font-medium" value={inputFatherName} onChange={(e) => setInputFatherName(e.target.value)} /></div>
                                <div className="col-span-5"><label className="label-tiny">SĐT bố</label><input className="form-input font-mono font-bold py-3 text-lg text-blue-700" value={inputFatherPhone} onChange={(e) => setInputFatherPhone(e.target.value)} /></div>
                                <div className="col-span-7"><label className="label-tiny">Họ tên mẹ</label><input className="form-input py-3 text-lg font-medium" value={inputMotherName} onChange={(e) => setInputMotherName(e.target.value)} /></div>
                                <div className="col-span-5"><label className="label-tiny">SĐT mẹ</label><input className="form-input font-mono font-bold py-3 text-lg text-blue-700" value={inputMotherPhone} onChange={(e) => setInputMotherPhone(e.target.value)} /></div>
                                <div className="col-span-12"><label className="label-tiny">Địa chỉ cư trú</label><input className="form-input py-3 text-lg font-medium" value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} /></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: SACRAMENTS (58%) */}
                <div className="w-full md:w-[58%] bg-slate-50/50 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-5">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <h4 className="font-black text-2xl text-purple-600 mb-6 flex items-center gap-3 border-b border-purple-100 pb-4"><ScrollText size={32}/> Hồ sơ bí tích</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Baptism */}
                            <div className="bg-blue-50/50 rounded-3xl border border-blue-100 overflow-hidden relative group transition-all">
                                <div className="bg-blue-100/80 px-5 py-2.5 border-b border-blue-200 flex items-center gap-2"><Droplets size={20} className="text-blue-600" /><span className="font-bold text-sm text-blue-800">Rửa tội</span></div>
                                <div className="p-4 grid grid-cols-2 gap-4">
                                    <div className="col-span-1"><label className="label-tiny">Ngày</label><input type="date" className="form-input py-3 text-base font-medium" value={inputBaptismDate} onChange={e => setInputBaptismDate(e.target.value)} /></div>
                                    <div className="col-span-1"><label className="label-tiny">Tại (Giáo xứ)</label><input className="form-input py-3 text-base font-medium" value={inputBaptismPlace} onChange={e => setInputBaptismPlace(e.target.value)} /></div>
                                    <div className="col-span-2"><label className="label-tiny">Linh mục</label><input className="form-input py-3 text-base font-medium" value={inputBaptismBy} onChange={e => setInputBaptismBy(e.target.value)} /></div>
                                    <div className="col-span-2"><label className="label-tiny">Người đỡ đầu</label><input className="form-input py-3 text-base font-medium" value={inputBaptismSponsor} onChange={e => setInputBaptismSponsor(e.target.value)} /></div>
                                </div>
                            </div>
                            
                            {/* Eucharist */}
                            <div className="bg-emerald-50/50 rounded-3xl border border-emerald-100 overflow-hidden relative group transition-all">
                                <div className="bg-emerald-100/80 px-5 py-2.5 border-b border-emerald-200 flex items-center gap-2"><BookOpen size={20} className="text-emerald-600" /><span className="font-bold text-sm text-emerald-800">Rước lễ lần đầu</span></div>
                                <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="label-tiny">Ngày</label><input type="date" className="form-input py-3 text-base font-medium" value={inputEucharistDate} onChange={e => setInputEucharistDate(e.target.value)} /></div>
                                        <div><label className="label-tiny">Tại (Giáo xứ)</label><input className="form-input py-3 text-base font-medium" value={inputEucharistPlace} onChange={e => setInputEucharistPlace(e.target.value)} /></div>
                                    </div>
                                    <div><label className="label-tiny">Linh mục chủ tế</label><input className="form-input py-3 text-base font-medium" value={inputEucharistBy} onChange={e => setInputEucharistBy(e.target.value)} /></div>
                                </div>
                            </div>

                            {/* Confirmation */}
                            <div className="bg-rose-50/50 rounded-3xl border border-rose-100 overflow-hidden relative group transition-all">
                                <div className="bg-rose-100/80 px-5 py-2.5 border-b border-rose-200 flex items-center gap-2"><Flame size={20} className="text-rose-600" /><span className="font-bold text-sm text-rose-800">Thêm sức</span></div>
                                <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="label-tiny">Ngày lãnh nhận</label><input type="date" className="form-input py-3 text-base font-medium" value={inputConfirmationDate} onChange={e => setInputConfirmationDate(e.target.value)} /></div>
                                        <div><label className="label-tiny">Tại (Giáo xứ)</label><input className="form-input py-3 text-base font-medium" value={inputConfirmationPlace} onChange={e => setInputConfirmationPlace(e.target.value)} /></div>
                                    </div>
                                    <div><label className="label-tiny">Đức Cha / Linh mục</label><input className="form-input py-3 text-base font-medium" value={inputConfirmationBy} onChange={e => setInputConfirmationBy(e.target.value)} /></div>
                                    <div><label className="label-tiny">Người đỡ đầu</label><input className="form-input py-3 text-base font-medium" value={inputConfirmationSponsor} onChange={e => setInputConfirmationSponsor(e.target.value)} /></div>
                                </div>
                            </div>

                            {/* Oath */}
                            <div className="bg-indigo-50/50 rounded-3xl border border-indigo-100 overflow-hidden relative group transition-all">
                                <div className="bg-indigo-100/80 px-5 py-2.5 border-b border-indigo-200 flex items-center gap-2"><Star size={20} className="text-indigo-600" /><span className="font-bold text-sm text-indigo-800">Bao đồng</span></div>
                                <div className="p-4">
                                    <label className="label-tiny">Ngày tuyên hứa</label>
                                    <input type="date" className="form-input py-3 text-lg font-bold w-full" value={inputOathDate} onChange={e => setInputOathDate(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Note Section */}
                    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm flex-1 flex flex-col min-h-[100px]">
                        <h4 className="font-bold text-sm text-slate-500 mb-3 flex items-center gap-2">Ghi chú thêm</h4>
                        <textarea className="form-input resize-none flex-1 text-base leading-relaxed font-medium" placeholder="Nhập các lưu ý quan trọng khác..." value={inputNote} onChange={e => setInputNote(e.target.value)}></textarea>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Warning Modal (Requested Feature) */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black/60 z-[400] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-amber-200">
               <div className="bg-amber-50 p-6 flex flex-col items-center text-center border-b border-amber-100">
                   <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4 animate-bounce">
                       <AlertCircle size={36} strokeWidth={2.5}/>
                   </div>
                   <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Phát hiện trùng hồ sơ!</h3>
                   <p className="text-sm text-slate-500 font-medium">Hệ thống tìm thấy học viên có cùng họ tên và ngày sinh đang sinh hoạt tại lớp khác.</p>
               </div>
               <div className="p-6">
                   <div className="space-y-3 mb-6">
                       {potentialDuplicates.map(s => (
                           <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                               <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs">#{s.id.slice(-4)}</div>
                               <div className="flex-1">
                                   <div className="text-sm font-bold text-slate-800">{s.saintName} {s.fullName}</div>
                                   <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Hiện thuộc: {getClassName(s.classId)}</div>
                               </div>
                           </div>
                       ))}
                   </div>
                   <div className="flex flex-col gap-3">
                        <button onClick={executeSave} className="w-full py-3 bg-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all text-sm uppercase tracking-widest">Tôi vẫn muốn thêm mới</button>
                        <button onClick={() => setShowDuplicateModal(false)} className="w-full py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm uppercase tracking-widest">Hủy & Kiểm tra lại</button>
                   </div>
               </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
        .form-input { width: 100%; padding: 0.75rem 1.1rem; border: 1.5px solid #e2e8f0; border-radius: 1.1rem; outline: none; transition: all 0.2s; font-size: 1.125rem; color: #1e293b; background-color: #fff; }
        .form-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.08); }
        .label-tiny { display: block; font-size: 0.85rem; font-weight: 800; color: #94a3b8; margin-bottom: 0.3rem; }
        .no-spinner::-webkit-inner-spin-button, .no-spinner::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
};
