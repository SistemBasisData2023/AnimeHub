import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaSearch, FaUserCircle } from 'react-icons/fa';
import {
  Container,
  Logo,
  Main,
  RightSide,
  MenuButton,
  MenuOptions,
  VerticalMenu,
  Buttons,
  SearchInput,
  AvatarMenu
} from './styles';

function Navbar({ onSearch }) {
  const menuRef = useRef();
  const profileMenuRef = useRef();
  const searchRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [opacity, setOpacity] = useState(0);

  
  useEffect(() => {
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function handleScroll() {
    if (window.scrollY > 10) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function handleClick(event) {
    if (showMenu && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
    if (showProfileMenu && !profileMenuRef.current.contains(event.target)) {
      setShowProfileMenu(false);
    }
    if (showSearch && !searchRef.current.contains(event.target)) {
      setShowSearch(false);
    }
  }

  function toggleProfileMenu() {
    setShowProfileMenu((prevShowProfileMenu) => !prevShowProfileMenu);
  }

  function handleSearchClick() {
    setShowSearch(true);
  }

  function handleSearchChange(event) {
    setSearchValue(event.target.value);
  }

  function handleSearchSubmit(event) {
    // prevent the page from refreshing
    event.preventDefault();

    // perform the search
    onSearch(searchValue);
  }

  return (
    <Container opacity={opacity} className="navbar bg-base-100">
      <Main>
        <div ref={menuRef}>
          <MenuButton onClick={() => setShowMenu(!showMenu)} className="btn btn-ghost normal-case text-xl">
            <FaBars className="text-white" style={{ fontSize: 'max(2rem, 2vw)' }} />
          </MenuButton>
          <MenuOptions hide={!showMenu} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <section>
              <a href="/" className="justify-between">
                Account
              </a>
              <a href="/">Help Center</a>
              <a href="/">Sign out</a>
            </section>
          </MenuOptions>
        </div>
        <Logo to="/" title="AnimeHub">
          <span className="text-red-500 text-2xl font-bold ml-4">AnimeHub</span>
        </Logo>
        <VerticalMenu className="text-white">
          <a href="/">Home</a>
          <a href="/">My List</a>
        </VerticalMenu>
      </Main>
      <RightSide>
        {!showSearch && (
          <div className="relative" ref={searchRef}>
            <button className="btn btn-ghost btn-circle" onClick={handleSearchClick}>
              <FaSearch className="text-white" style={{ fontSize: '1.5rem' }} />
            </button>
          </div>
        )}
  {showSearch && (
          <form onSubmit={handleSearchSubmit}>
            <SearchInput
              value={searchValue}
              onChange={handleSearchChange}
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
              onBlur={() => setShowSearch(false)}
              autoFocus
            />
          </form>
        )}
        <Buttons>
          <div ref={profileMenuRef} className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar" onClick={toggleProfileMenu}>
              <div className="w-10 rounded-full">
                <FaUserCircle className="text-white" style={{ fontSize: '1.5rem' }} />
              </div>
            </label>
            {showProfileMenu && (
              <AvatarMenu className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <a href="/" className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a href="/">Settings</a>
                </li>
                <li>
                  <a href="/">Logout</a>
                </li>
              </AvatarMenu>
            )}
          </div>
        </Buttons>
      </RightSide>
    </Container>
  );
}

export default Navbar;
