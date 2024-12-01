<?php declare(strict_types=1);

namespace Fpv\Domain;

abstract class AbstractSerializable implements \JsonSerializable
{
    /**
     * {@inheritdoc}
     */
    public function jsonSerialize(): array
    {
        $reflection = new \ReflectionClass($this);
        $properties = $reflection->getProperties();
        $data = [];

        foreach ($properties as $property) {
            $property->setAccessible(true);
            $name = $property->getName();

            if (in_array($name, $this->getExcludedProperties(), true)) {
                continue;
            }

            $value = $property->getValue($this);

            if ($value instanceof \DateTimeInterface) {
                $value = $value->format(\DateTimeInterface::ATOM);
            }

            $data[$name] = $value;
        }

        return $data;
    }

    protected function getExcludedProperties(): array
    {
        return [];
    }
}