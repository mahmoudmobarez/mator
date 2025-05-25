
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Transaction, UserRole, PaymentMethod } from '../types';
import PageWrapper from './common/PageWrapper';
import Button from './common/Button';
import Input from './common/Input';
import Modal from './common/Modal';

const WalletPage: React.FC = () => {
  const { walletBalance, updateWalletBalance, userRole, addNotification, isLoading, setLoading } = useAppContext();
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'txn1', type: 'topup', amount: 50, date: new Date(Date.now() - 86400000), description: 'Initial balance' },
  ]);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(20);
  
  // Mock payment methods, in real app this would come from user's profile or context
  const [paymentMethods] = useState<PaymentMethod[]>([ 
    { id: 'pm1', type: 'card', last4: '1234', name: 'Visa **** 1234' },
    { id: 'pm2', type: 'paypal', name: 'PayPal (user@example.com)' },
  ]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(paymentMethods[0]?.id || '');


  const handleTopUp = async () => {
    if (topUpAmount <= 0) {
      addNotification('Top-up amount must be positive.', 'warning');
      return;
    }
    if (!selectedPaymentMethod && userRole === UserRole.RIDER) {
        addNotification('Please select a payment method.', 'warning');
        return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    updateWalletBalance(topUpAmount, 'add');
    const newTransaction: Transaction = {
      id: 'txn' + Date.now(),
      type: 'topup',
      amount: topUpAmount,
      date: new Date(),
      description: `Topped up via ${userRole === UserRole.RIDER ? (paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name || 'selected method') : 'Driver Top-up'}`,
    };
    setTransactions(prev => [newTransaction, ...prev]);
    addNotification(`Successfully topped up $${topUpAmount.toFixed(2)}!`, 'success');
    setIsTopUpModalOpen(false);
    setTopUpAmount(20); // Reset
    setLoading(false);
  };
  
  const QuickTopUpButton: React.FC<{amount: number}> = ({amount}) => (
    <Button 
        variant="secondary" 
        onClick={() => { setTopUpAmount(amount); setIsTopUpModalOpen(true); }}
        className="flex-1"
    >
        ${amount}
    </Button>
  );

  return (
    <PageWrapper title="My Wallet">
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-yellow-400 to-red-500 p-8 rounded-xl shadow-2xl text-center text-slate-900">
          <p className="text-sm font-medium opacity-90">Current Balance</p>
          <p className="text-5xl font-bold">${walletBalance.toFixed(2)}</p>
        </div>

        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-200">Quick Top-up</h3>
            <div className="grid grid-cols-3 gap-2">
                <QuickTopUpButton amount={10} />
                <QuickTopUpButton amount={20} />
                <QuickTopUpButton amount={50} />
            </div>
            <Button onClick={() => setIsTopUpModalOpen(true)} fullWidth variant="primary">
                Custom Top-Up / Manage
            </Button>
        </div>


        <div>
          <h3 className="text-xl font-semibold text-yellow-400 mb-3">Transaction History</h3>
          {transactions.length === 0 ? (
            <p className="text-slate-400">No transactions yet.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto bg-slate-800 p-4 rounded-lg">
              {transactions.map(txn => (
                <div key={txn.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-md shadow">
                  <div>
                    <p className={`font-semibold capitalize ${txn.type === 'topup' || txn.type === 'payout' ? 'text-green-400' : 'text-red-400'}`}>
                      {txn.type}
                    </p>
                    <p className="text-xs text-slate-400">{txn.description}</p>
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${txn.type === 'topup' || txn.type === 'payout' ? 'text-green-400' : 'text-red-400'}`}>
                      {txn.type === 'topup' || txn.type === 'payout' ? '+' : '-'}${txn.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500 text-right">{txn.date.toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isTopUpModalOpen} onClose={() => setIsTopUpModalOpen(false)} title="Top Up Wallet">
        <div className="space-y-4">
          <Input 
            label="Amount to Top Up" 
            type="number" 
            value={topUpAmount.toString()} 
            onChange={e => setTopUpAmount(parseFloat(e.target.value))} 
            min="5" 
            step="1"
            disabled={isLoading}
          />
          {userRole === UserRole.RIDER && paymentMethods.length > 0 && (
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-300 mb-1">Payment Method</label>
              <select 
                id="paymentMethod"
                value={selectedPaymentMethod} 
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                disabled={isLoading}
              >
                {paymentMethods.map(pm => (
                  <option key={pm.id} value={pm.id}>{pm.name}</option>
                ))}
              </select>
            </div>
          )}
          {userRole === UserRole.RIDER && paymentMethods.length === 0 && (
            <p className="text-sm text-red-400">No payment methods found. Please <a href="#/profile" className="underline">add one in your profile</a>.</p>
          )}
          <Button onClick={handleTopUp} fullWidth disabled={isLoading || (userRole === UserRole.RIDER && paymentMethods.length === 0)}>
            {isLoading ? 'Processing...' : `Top Up $${topUpAmount.toFixed(2)}`}
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default WalletPage;
    