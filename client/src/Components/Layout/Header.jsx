import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyInfo } from "../../redux/slices/companyDetailsSlices";
import logo from "../../assets/Fem-Cartel-Wording-1400x352.png";
import womenImage from "../../assets/0106_SP25_MarketingMoment_Dreamknit_Womens.webp";
import accessoriesImage from "../../assets/0106_SP25_MarketingMoment_Accessories.webp";
import shoesImage from "../../assets/0106_SP25_MarketingMoment_ACTVCLUB.webp";
import TopNav from "./TopNav";
import { fetchWishlistItems } from "../../redux/slices/wishlistSlices";
import { fetchCartItems } from "../../redux/slices/cartSlices";
import IconSection from "./HeaderIconSection";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { companys } = useSelector((state) => state.company);



  // Other Header UI states
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showTopNav, setShowTopNav] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);


  
  let hoverTimeout = null;

  useEffect(() => {
    dispatch(fetchCompanyInfo());
  }, [dispatch]);

  // Whenever `user` becomes available (or on page refresh), re-load wishlist & cart
  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchWishlistItems(user._id));
      dispatch(fetchCartItems(user._id)); // make sure you have a fetchCartItems thunk
    }
  }, [dispatch, user]);



  // Dropdown data for nav items
  const dropdownItems = {
    women: {
      featured: ["New Arrivals", "Best Sellers", "Sale", "Shop All"],
      tops: [
        "Tanks",
        "Sports Bras",
        "Short Sleeve Tops",
        "Long Sleeve Tops",
        "Hoodies & Sweatshirts",
        "Shirt Jackets",
        "Outerwear",
      ],
      bottoms: [
        "Leggings",
        "Joggers & Sweatpants",
        "Pants & Trousers",
        "Shorts & Skirts",
        "Dresses & Jumpsuits",
        "Shop All Bottoms",
      ],
      // shopByActivity: ["Training", "Running", "Swim", "Yoga", "Travel", "Tennis & Golf"],
      image: womenImage,
    },
    shoes: {
      items: [
        "Cross Training Shoes",
        "Running Shoes",
        "Slides",
        "Sneakers",
        "Trail Running Shoes",
        "Workout Shoes",
      ],
      image: shoesImage,
    },
    accessories: {
      product: [
        "Bags",
        "Hats",
        "Sunglasses",
        "Belts",
        "Jewelry",
        "Scarves",
        "Watches",
        "Other Accessories",
      ],
      image: accessoriesImage,
    },
  };

  // Hide top nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowTopNav(window.scrollY === 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (category) => {
    clearTimeout(hoverTimeout);
    setHoveredItem(category);
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setDropdownVisible(false);
      setHoveredItem(null);
    }, 200);
  };

 

  return (
    <header>
      <TopNav showTopNav={showTopNav} companys={companys} />

      <div className="Header">
        <div className="Header-container">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Middle Navigation Menu */}
          <div className="middle">
            <ul className="nav-list">
              <li
                className="nav-item"
                onMouseEnter={() => handleMouseEnter("women")}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="/products">Women</Link>
              </li>
              <li
                className="nav-item"
                onMouseEnter={() => handleMouseEnter("accessories")}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="/products">Accessories</Link>
              </li>
              <li
                className="nav-item"
                onMouseEnter={() => handleMouseEnter("shoes")}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="/products">Shoes</Link>
              </li>
              <li className="nav-item">
                <Link to="/products">We Made Too Much</Link>
              </li>

              <li className="nav-item active">
                <Link to="/products" className="active">
                  Valentine's Day
                </Link>
              </li>
            </ul>
          </div>

          {/* Icon Section */}
          <IconSection />
        </div>

        {dropdownVisible && hoveredItem && (
          <Dropdown
            items={dropdownItems[hoveredItem]}
            category={hoveredItem}
            onMouseEnter={() => handleMouseEnter(hoveredItem)}
            onMouseLeave={handleMouseLeave}
          />
        )}
      </div>
    </header>
  );
};

const Dropdown = ({ items, category, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className="full-width-dropdown open"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="dropdown-content">
        <div className="dropdown-sections">
          {Object.entries(items).map(([section, values]) =>
            section !== "image" ? (
              <div className="dropdown-section" key={section}>
                <h4>{section.replace(/([A-Z])/g, " $1").trim()}</h4>
                <ul>
                  {values.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={`/${category}/${item
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </div>
        {items.image && (
          <div className="dropdown-image">
            <img src={items.image} alt={`${category} section`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
