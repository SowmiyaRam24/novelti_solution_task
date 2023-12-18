import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFormData, clearFormData, setCountries } from './redux/actions';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import Select from 'react-select';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
} from 'react-bootstrap';

const App = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.formData);
  const countries = useSelector((state) => state.countries);
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        const countryData = response.data.map((country) => ({
          value: country.name.common,
          label: country.name.common,
        }));
        dispatch(setCountries(countryData));
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, [dispatch]);

  const handleCountryChange = async (selectedCountry) => {
    dispatch(
      setFormData({
        ...formData,
        country: selectedCountry ? selectedCountry.value : '',
      })
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName || formData.firstName.length < 5) {
      newErrors.firstName = 'First Name should be at least 5 characters';
    }

    if (!formData.lastName || formData.lastName.length < 5) {
      newErrors.lastName = 'Last Name should be at least 5 characters';
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid Email';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile Number is required';
    }

    if (!formData.address1) {
      newErrors.address1 = 'Address 1 is mandatory';
    }

    if (!formData.country) {
      newErrors.country = 'Select a country';
    }

    if (!/^\d+$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid Zip Code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editIndex === -1) {
        setSubmittedData([...submittedData, formData]);
      } else {
        const updatedData = [...submittedData];
        updatedData[editIndex] = formData;
        setSubmittedData(updatedData);
        setEditIndex(-1);
      }

      dispatch(clearFormData());
    }
  };

  const handleEdit = (index) => {
    dispatch(setFormData(submittedData[index]));
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedData = [...submittedData];
    updatedData.splice(index, 1);
    setSubmittedData(updatedData);
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Col xs={10}>
          <h4>Form</h4>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    dispatch(setFormData({ ...formData, firstName: e.target.value }))
                  }
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    dispatch(setFormData({ ...formData, lastName: e.target.value }))
                  }
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    dispatch(setFormData({ ...formData, email: e.target.value }))
                  }
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Mobile Number</Form.Label>
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={formData.mobile}
                  onChange={(value) =>
                    dispatch(setFormData({ ...formData, mobile: value }))
                  }
                  isInvalid={!!errors.mobile}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mobile}
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Address 1</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.address1}
                  onChange={(e) =>
                    dispatch(setFormData({ ...formData, address1: e.target.value }))
                  }
                  isInvalid={!!errors.address1}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address1}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Address 2</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.address2}
                  onChange={(e) =>
                    dispatch(setFormData({ ...formData, address2: e.target.value }))
                  }
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Country</Form.Label>
                <Select
                  value={formData.country}
                  onChange={(selectedCountry) => handleCountryChange(selectedCountry)}
                  options={countries}
                  isSearchable
                  isClearable
                />
                {errors.country && (
                  <div className="invalid-feedback">{errors.country}</div>
                )}
              </Col>
              <Col>
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) =>
                    dispatch(setFormData({ ...formData, zipCode: e.target.value }))
                  }
                  isInvalid={!!errors.zipCode}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.zipCode}
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Button type="submit" variant="primary">
              {editIndex === -1 ? 'Submit' : 'Update'}
            </Button>
            {editIndex !== -1 && (
              <Button
                variant="secondary"
                onClick={() => setEditIndex(-1)}
                className="ms-2"
              >
                Cancel Edit
              </Button>
            )}
          </Form>
        </Col>
        <Col xs={10} className="mt-4">
          {submittedData.map((data, index) => (
            <div key={index} className="mb-3">
              <h6>User Information {index + 1}</h6>
              <p>
                <strong>Name:</strong> {data.firstName} {data.lastName} {data.country} {data.email}
              </p>
              <Button
                variant="primary"
                onClick={() => handleEdit(index)}
                className="me-2"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleDelete(index)}
              >
                Delete
              </Button>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
