
import React, { useState } from 'react';
import PageWrapper from './common/PageWrapper';
import { MOCK_FAQS, BRAND_COLORS } from '../constants';
import { FAQItem } from '../types';
import Input from './common/Input';
import Button from './common/Button';
import { useAppContext } from '../contexts/AppContext';

const FAQListItem: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 px-2 text-left hover:bg-slate-800 transition"
      >
        <span className="font-medium text-slate-100">{item.question}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="px-2 pb-4 text-slate-300 bg-slate-800/50">
          {item.answer}
        </div>
      )}
    </div>
  );
};

const SupportPage: React.FC = () => {
  const { addNotification, isLoading, setLoading } = useAppContext();
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'support', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [issueSubject, setIssueSubject] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'faq' | 'chat' | 'report'>('faq');

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    setLoading(true);
    // Simulate support response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'support', text: "Thanks for your message. A support agent will be with you shortly. (This is a mock response)" }]);
      setLoading(false);
    }, 1500);
    setChatInput('');
  };

  const handleReportIssue = async () => {
    if (!issueSubject.trim() || !issueDescription.trim()) {
      addNotification('Please fill in both subject and description.', 'warning');
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    addNotification('Issue reported successfully. We will get back to you soon.', 'success');
    setIssueSubject('');
    setIssueDescription('');
    setLoading(false);
  };
  
  const TabButton: React.FC<{label: string; tabKey: 'faq' | 'chat' | 'report'}> = ({label, tabKey}) => (
    <Button
        variant={activeTab === tabKey ? 'primary' : 'ghost'}
        onClick={() => setActiveTab(tabKey)}
        className="flex-1 capitalize"
    >
        {label}
    </Button>
  );

  return (
    <PageWrapper title="Help & Support" showBackButton>
      <div className="mb-6 flex space-x-2 border-b-2 border-slate-700 pb-2">
        <TabButton label="FAQs" tabKey="faq" />
        <TabButton label="Live Chat" tabKey="chat" />
        <TabButton label="Report Issue" tabKey="report" />
      </div>

      {activeTab === 'faq' && (
        <div className="bg-slate-800 rounded-lg shadow-lg">
          {MOCK_FAQS.map(faq => <FAQListItem key={faq.id} item={faq} />)}
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg space-y-4">
          <h3 className="text-xl font-semibold text-yellow-400">Live Chat</h3>
          <div className="h-64 overflow-y-auto border border-slate-700 rounded p-3 space-y-2 bg-slate-900">
            {chatMessages.length === 0 && <p className="text-slate-400 text-center py-8">Chat with support here.</p>}
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[70%] p-2 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-700 text-slate-200'}`}>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              placeholder="Type your message..." 
              onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button onClick={handleSendChatMessage} disabled={isLoading || !chatInput.trim()}>Send</Button>
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg space-y-4">
          <h3 className="text-xl font-semibold text-yellow-400">Report an Issue</h3>
          <Input label="Subject" value={issueSubject} onChange={e => setIssueSubject(e.target.value)} placeholder="e.g., Problem with last ride" disabled={isLoading} />
          <textarea 
            value={issueDescription} 
            onChange={e => setIssueDescription(e.target.value)} 
            placeholder="Describe your issue in detail..." 
            rows={5}
            className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 sm:text-sm"
            disabled={isLoading}
          />
          <Button onClick={handleReportIssue} fullWidth disabled={isLoading || !issueSubject.trim() || !issueDescription.trim()}>
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      )}
    </PageWrapper>
  );
};

export default SupportPage;
    