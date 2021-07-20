import { Fragment } from 'react';

import classNames from 'utils/classnames';

import { Menu, Transition } from '@headlessui/react';

import {
  ChevronRightIcon,
  DotsVerticalIcon,
  DuplicateIcon,
  PencilAltIcon,
  TrashIcon,
  UserAddIcon,
} from '@heroicons/react/solid';

const ProjectsTable = ({ items }) => (
  <>
    {/* Projects list (only on smallest breakpoint) */}
    <div className="mt-10 sm:hidden">
      <div className="px-4 sm:px-6">
        <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Projects</h2>
      </div>
      <ul className="mt-3 border-t border-gray-200 divide-y divide-gray-100">
        {items.map((project) => (
          <li key={project.id}>
            <a
              href="#"
              className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6"
            >
              <span className="flex items-center truncate space-x-3">
                <span
                  className={classNames(
                    project.bgColorClass,
                    'w-2.5 h-2.5 flex-shrink-0 rounded-full'
                  )}
                  aria-hidden="true"
                />
                <span className="font-medium truncate text-sm leading-6">
                  {project.title}{' '}
                  <span className="truncate font-normal text-gray-500">in {project.team}</span>
                </span>
              </span>
              <ChevronRightIcon
                className="ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
    {/* Projects list */}
    <div className="hidden mt-8 sm:block">
      <div className="align-middle inline-block min-w-full border-b border-gray-200">
        <table className="min-w-full">
          <thead>
            <tr className="border-t border-gray-200">
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="lg:pl-2">Project</span>
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members
              </th>
              <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last updated
              </th>
              <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {items.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center space-x-3 lg:pl-2">
                    <div
                      className={classNames(
                        project.bgColorClass,
                        'flex-shrink-0 w-2.5 h-2.5 rounded-full'
                      )}
                      aria-hidden="true"
                    />
                    <a href="#" className="truncate hover:text-gray-600">
                      <span>
                        {project.title}{' '}
                        <span className="text-gray-500 font-normal">in {project.team}</span>
                      </span>
                    </a>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-500 font-medium">
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-shrink-0 -space-x-1">
                      {project.members.map((member) => (
                        <img
                          key={member.handle}
                          className="max-w-none h-6 w-6 rounded-full ring-2 ring-white"
                          src={member.imageUrl}
                          alt={member.name}
                        />
                      ))}
                    </div>
                    {project.totalMembers > project.members.length ? (
                      <span className="flex-shrink-0 text-xs leading-5 font-medium">
                        +{project.totalMembers - project.members.length}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                  {project.lastUpdated}
                </td>
                <td className="pr-6">
                  <Menu as="div" className="relative flex justify-end items-center">
                    {({ open }) => (
                      <>
                        <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                          <span className="sr-only">Open options</span>
                          <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
                        </Menu.Button>
                        <Transition
                          show={open}
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            static
                            className="mx-3 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-10 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
                          >
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                      'group flex items-center px-4 py-2 text-sm'
                                    )}
                                  >
                                    <PencilAltIcon
                                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />
                                    Edit
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                      'group flex items-center px-4 py-2 text-sm'
                                    )}
                                  >
                                    <DuplicateIcon
                                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />
                                    Duplicate
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                      'group flex items-center px-4 py-2 text-sm'
                                    )}
                                  >
                                    <UserAddIcon
                                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />
                                    Share
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                      'group flex items-center px-4 py-2 text-sm'
                                    )}
                                  >
                                    <TrashIcon
                                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />
                                    Delete
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

ProjectsTable.propTypes = {};

ProjectsTable.defaultProps = {};

export default ProjectsTable;
