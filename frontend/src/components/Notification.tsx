import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import { NotificationProps } from '../models/NotificationProps';

const Notification = ({ open = false, color, heading, message, close }: NotificationProps) => {

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => close()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`bg-${color}-50 p-4 shadow-${color}-400 w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all`}>
                <div className="flex items-center gap-x-4">
                  <div className="flex-shrink-0">
                    { color === 'green' && <CheckCircleIcon className={`h-8 w-8 text-${color}-400`} aria-hidden="true" /> }
                    { color === 'yellow' && <InformationCircleIcon className={`h-8 w-8 text-${color}-400`} aria-hidden="true" /> }
                    { color === 'red' && <ExclamationTriangleIcon className={`h-8 w-8 text-${color}-400`} aria-hidden="true" /> }
                  </div>
                  <Dialog.Title
                    as="h3"
                    className={`grow text-lg font-medium leading-6 text-${color}-800`}
                  >{heading}</Dialog.Title>
                  <button
                    color="button"
                    className={`self-end inline-flex rounded-md bg-${color}-50 p-1.5 text-${color}-500 hover:bg-${color}-100 focus:outline-none focus:ring-2 focus:ring-${color}-600 focus:ring-offset-2 focus:ring-offset-${color}-50`}
                    onClick={() => close()}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-8 w-8" aria-hidden="true" />
                  </button>
                </div>
                { message && <div className={`mt-2 text-md text-${color}-700`}>
                  <p>{message}</p>
                </div>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Notification;
