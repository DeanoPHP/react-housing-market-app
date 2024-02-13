import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItems from '../components/ListingItems';

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [formData, setFormData] = useState({
    city: '',
  });

  const { city } = formData;

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingRef = collection(db, 'listings');

        // Create a query
        const q = query(
          listingRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10),
        );

        // Execute query
        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length - 1];

        setLastFetchedListing(lastVisible);

        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };

    fetchListings();
  }, [params.categoryName]);

  // Pagiation / loading
  const onFetchMoreListings = async () => {
    try {
      // Get reference
      const listingRef = collection(db, 'listings');

      // Create a query
      const q = query(
        listingRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10),
      );

      // Execute query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];

      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prev) => [...prev, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings');
    }
  };

  // put an onClick here which will take the listings and map through them only getting the listings that are spacific to that town or city
  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value.toLowerCase().trim(),
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check whether city is empty 
      if (city === '') {
        setListings((prev) => [...prev])
        return
      }

      // Get reference
      const listingRef = collection(db, 'listings');

      // Create a query
      const q = query(
        listingRef,
        where('city', '==', city),
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        limit(10),
      );

      // Execute query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];

      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setFormData({
        city: ''
      })
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings!!');
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === 'rent'
            ? 'Places for rent'
            : 'Places for sell'}
        </p>
        {/* onClick, onSubmit, listings.map((area) => area === '') */}
        <form onSubmit={onSubmit}>
          <label htmlFor="city" className="formLabel">
            Narrow Your Search
          </label>
          <input
            type="text"
            name="city"
            className="formInputName"
            onChange={onChange}
            id="city"
            value={city.trim()}
          />
          <div className="buttons">
            <button type="submit" className="formButtonActive">
              Submit
            </button>
            <button type="submit" className="formButtonReset" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        </form>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItems
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No listings for {params.categoryName}. Please try another Town or City</p>
      )}
    </div>
  );
}

export default Category;
