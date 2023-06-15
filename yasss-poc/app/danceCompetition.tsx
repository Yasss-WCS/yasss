'use client'
import React, { useEffect, useState } from 'react';
import Couple from './couple';
import Modal from 'react-modal'

// Modal.setAppElement('#root');


const DanceCompetition = () => {
  // const rootUrl = 'https://us-central1-westiecode.cloudfunctions.net/yass-api'
  const [couples, setCouples] = useState(['Loading']);
  const [judgeName, setJudgeName] = useState('');
  const [eventName, setEventName] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sheetId = urlParams.get('spreadsheet_id');
    const division = urlParams.get('division');
    const round = urlParams.get('round');
    const judgeName = urlParams.get('judge_name');
    const eventName = urlParams.get('event_name');
    setJudgeName(judgeName ?? '');
    setEventName(eventName ?? '');
    fetch(`/yass-api/?action=get_competitors&spreadsheet_id=${sheetId}&division=${division}&role=L&round=${round}`, { mode: 'cors' })
      .then(response => response.json())
      .then(jsonData => {
        setCouples(jsonData); // set state here
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }, []); // Empty array means this effect runs once when the component mounts.


  const [modalIsOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const moveCouple = (index: number, direction: number) => {
    const newCouples = [...couples];
    const [removed] = newCouples.splice(index, 1);
    newCouples.splice(index + direction, 0, removed);
    setCouples(newCouples);
  };

  const moveUp = (index: number) => {
    if (index > 0) moveCouple(index, -1);
  };

  const moveDown = (index: number) => {
    if (index < couples.length - 1) moveCouple(index, 1);
  };

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  const handleSubmit = () => {
    setSubmitted(true);
    
    const urlParams = new URLSearchParams(window.location.search);
    const sheetId = urlParams.get('spreadsheet_id');
    const division = urlParams.get('division');
    const round = urlParams.get('round');
    const judge_name = urlParams.get('judge_name');
    const toSubmit: { [key: string]: number } = {};
    fetch(`/yass-api/?action=submit_scores&spreadsheet_id=${sheetId}&division=${division}&role=L&round=${round}&judge_name=${judge_name}`,
      {
        mode: 'cors', method: "POST",
        body: JSON.stringify(couples.reduce((result, item, index) => {
          result[item] = index + 1;
          return result;
        }, toSubmit)),
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(response => response.json())
      .then(() => {
        // TODO add alerts
      })
      .catch(() => {
        // TODO add alerts
      });
      closeModal();
  }

  return (
    <div className="h-screen bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-4">{eventName}</h1>
      <h2 className="text-xl font-bold text-center mb-4">Judge: {judgeName}</h2>
      {couples.map((names, index) => (
        <Couple
          key={index}
          index={index}
          names={names}
          moveUp={() => moveUp(index)}
          moveDown={() => moveDown(index)}
          disabled={submitted}
        />
      ))}

      {submitted ? (
        <p className="text-center text-green-500">Thank you for submitting your scores!</p>
      ) : (
        <>
          <button
            onClick={openModal}
            className="w-full sm:w-auto block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Submit
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Submission Confirmation Modal"
            className="p-4 border-0 rounded-md shadow-lg relative mx-auto my-12 w-full max-w-lg bg-white text-gray-800"
          >
            <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
            <p className="mb-6">Are you sure you want to submit? Once you submit, you may not change your rankings.</p>
            <div className="flex justify-evenly">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                OK
              </button>
              <button
                onClick={closeModal}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mr-2"
              >
                Cancel
              </button>

            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default DanceCompetition;
