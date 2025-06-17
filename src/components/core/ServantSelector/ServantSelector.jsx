/**
 * ServantSelector.jsx
 * FGO Bond Calculator - Servant Selection Component
 * 
 * Handles servant search, filtering, and selection with fuzzy search capabilities
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-16
 */

import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import Fuse from 'fuse.js';
import axios from 'axios';
import { ClassIcon } from './ClassIcon';
import styles from './ServantSelector.module.css';
import '../../../styles/theme.css';

const ServantSelector = ({
  selectedServant, 
  onServantChange, 
  isJPServer, 
  onServantsLoaded 
}) => {
  const [servants, setServants] = useState([]);
  const [options, setOptions] = useState([]);
  // Fuzzy search config
  const fuse = new Fuse(servants, {
    keys: ["name", "className"],
    threshold: 0.28,
    ignoreLocation: true,
    minMatchCharLength: 1,
  });
  // Fetch servants from local file
  useEffect(() => {
    let isMounted = true;
    const fetchLocalServants = async () => {
      try {
        const fileName = isJPServer ? 'servants_jp.json' : 'servants.json';
        console.log(`Loading ${isJPServer ? 'JP' : 'NA'} servant data from ${fileName}...`);
        
        const response = await axios.get(`${process.env.PUBLIC_URL}/${fileName}`);
        
        if (isMounted) {
          setServants(response.data);
          console.log(`Loaded ${response.data.length} ${isJPServer ? 'JP' : 'NA'} servants`);
          
          // Call parent callback to update bond levels
          if (onServantsLoaded) {
            onServantsLoaded(response.data);
          }
        }
      } catch (error) {
        console.error(`Error loading ${isJPServer ? 'JP' : 'NA'} servant data:`, error);
        if (isMounted) {
          setServants([]);
        }
      }
    };

    fetchLocalServants();
    return () => { isMounted = false; };
  }, [isJPServer, onServantsLoaded]);

  // Update options when servants change
  useEffect(() => {
    const servantOptions = servants.map((servant) => ({
      value: servant.id,
      label: servant.name,
      servant: servant,
    }));
    setOptions(servantOptions);
  }, [servants]);  // Custom Option component for react-select
  const CustomOption = (props) => {
    const { data } = props;
    const servant = data.servant;
    
    // Determine star styling class
    const getStarClass = (rarity) => {
      if (rarity <= 2) return styles.bronze;
      if (rarity <= 3) return styles.silver;
      return styles.gold;
    };

    // Generate individual stars
    const renderStars = (rarity) => {
      return '★'.repeat(rarity);
    };

    return (
      <components.Option {...props}>
        <div className={styles['option-container']}>
          <div className={`${styles['option-stars']} ${getStarClass(servant.rarity)}`}>
            {renderStars(servant.rarity)}
          </div>
          <div className={styles['option-divider']}></div>
          <div className={styles['option-name']}>
            {data.label}
          </div>
          <div className={styles['option-class']}>
            <ClassIcon servant={servant} />
          </div>
        </div>
      </components.Option>
    );
  };

  // Custom SingleValue component for react-select
  const CustomSingleValue = (props) => {
    const { data } = props;
    return (
      <components.SingleValue {...props}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClassIcon servant={data.servant} />
          <span style={{ marginLeft: '8px' }}>{data.label}</span>
        </div>
      </components.SingleValue>
    );
  };
  // Filter function for react-select
  const filterOption = (option, inputValue) => {
    if (!inputValue) return true;
    if (!option || !option.data || !option.data.servant) return false;
    
    const results = fuse.search(inputValue);
    return results.some(result => result.item.id === option.data.servant.id);
  };return (
    <div className={styles['servant-selector']}>
      <Select
        value={selectedServant}
        onChange={onServantChange}
        options={options}
        placeholder={`Search for a ${isJPServer ? 'JP' : 'NA'} servant...`}
        isSearchable
        isClearable
        filterOption={filterOption}
        components={{
          Option: CustomOption,
          SingleValue: CustomSingleValue,
        }}
        classNamePrefix="react-select"
        noOptionsMessage={() => "No servants found"}
        loadingMessage={() => "Loading servants..."}
      />
    </div>
  );
};

export default ServantSelector;
