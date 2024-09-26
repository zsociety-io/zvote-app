import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { get_request } from '../lib/utils/network.js';
import Image from "next/image"
import Link from "next/link"

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 50px;

  // Animation styles
  max-height: ${({ expanded }) => (expanded ? '1000px' : '0')}; // Adjust max-height dynamically
  opacity: ${({ expanded }) => (expanded ? '1' : '0')};
  overflow: hidden;
  transition: max-height 1s ease-out, opacity 0.1s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  color: #3d3d3d;
  margin-bottom: 30px;
  margin-top: 15px;
  font-family: 'Roboto', sans-serif;
`;

const DAOList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  animation: ${fadeIn} 0.6s ease-in-out;
`;

const DAOItem = styled.li`
  display: flex;
  justify-content: space-between; /* Moves the image to the right */
  align-items: center; /* Centers the content vertically */
  background-color: #ffffff;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px 30px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DAOName = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
  font-family: 'Lekton', sans-serif;
  font-weight: 700;
`;

const DAODescription = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  font-family: 'Open Sans', sans-serif;
`;

const NoDAOsMessage = styled.p`
  font-size: 1.2rem;
  color: #888;
  text-align: center;
  margin-top: 50px;
  font-family: 'Open Sans', sans-serif;
`;
const DAOsList = () => {
  const { requestTransaction, publicKey } = useWallet();
  const [daos, setDaos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDaos = async () => {
    try {
      const newDaos = await get_request(`/api/contract/daos/${publicKey}`);
      setDaos(newDaos);
    } catch (error) {
      console.error('Failed to load DAOs:', error);
    } finally {
      setIsLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    if (publicKey != null) {
      loadDaos();
    }
  }, [publicKey]);

  return (
    <>
      <Container expanded={daos.length > 0 && !isLoading}>
        <Title>My DAOs</Title>
        {daos.length > 0 ? (
          <DAOList>
            {daos.map((dao, index) => (
              <Link href={`/dashboard/${dao.dao_id}`} key={index} style={{ display: "block" }}>
                <DAOItem>
                  <div>
                    <DAOName>{`${dao.token.token_data.name} (${dao.token.token_data.symbol})`}</DAOName>
                    <DAODescription>
                      <span style={{ fontWeight: 700 }}>DAO ID:</span> {dao.dao_id.slice(0, 5) + "..." + dao.dao_id.slice(-10, dao.dao_id.length)}
                    </DAODescription>
                  </div>
                  <ImageContainer>
                    <Image src={require("@/img/dao-manage.png").default} alt="wallet" height={35} />
                  </ImageContainer>
                </DAOItem>
              </Link>
            ))}
          </DAOList>
        ) : (
          !isLoading && <NoDAOsMessage>No DAOs found.</NoDAOsMessage>
        )}
      </Container>
    </>
  );
};

export default DAOsList;